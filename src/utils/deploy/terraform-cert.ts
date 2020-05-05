import { exec } from "child_process";
import { join } from "path";
import { promisify } from "util";

import * as Listr from "listr";
import filterEnv from "../filter-env";
import { Context } from "./types";
import { writeJSON } from "fs-extra";

const execp = promisify(exec);

export const title = "Provision Certificate";

const extract = (ctx: Context) => {
  const { terraformDir } = ctx;
  if (terraformDir === undefined)
    throw new Error("terraform dir not available");
  const terraformCertDir = join(terraformDir, "cert");
  if (terraformCertDir === undefined)
    throw new Error("terraform/cert dir not available ");
  const region = ctx.flags.region as string;

  return { terraformCertDir: terraformCertDir, region };
};

const terraformInit = async (ctx: Context) => {
  const { terraformCertDir, region } = extract(ctx);

  await execp("terraform init", {
    cwd: terraformCertDir,
    env: filterEnv({ ...process.env, AWS_REGION: region }),
  });
};

const prepareTfVars = async (ctx: Context) => {
  const { terraformCertDir } = extract(ctx);
  const varFile = join(terraformCertDir, "terraform.tfvars.json");
  const { cert } = ctx;
  await writeJSON(varFile, {
    hosted_zone_id: cert?.hostedZoneId,
    domain_name: cert?.zoneName,
    alternative_names: [`*.${cert?.zoneName}`],
  });
};

const terraformApply = async (ctx: Context) => {
  const { terraformCertDir, region } = extract(ctx);

  await execp("terraform apply -auto-approve", {
    cwd: terraformCertDir,
    env: filterEnv({ ...process.env, AWS_REGION: region }),
  });
};

const terraformOutput = async (ctx: Context) => {
  const { terraformCertDir } = extract(ctx);
  const { stdout } = await execp("terraform output -json", {
    cwd: terraformCertDir,
    env: filterEnv(process.env),
  });
  const output = JSON.parse(stdout);
  // @ts-ignore
  ctx.cert = {
    ...(ctx.cert || {}),
    certArn: output.cert_arn.value,
  };
};

export const task = () =>
  new Listr([
    { title: "terraform init", task: terraformInit },
    { title: "prepare tfvars", task: prepareTfVars },
    {
      title: "terraform apply (this can take up to 5 minutes)",
      task: terraformApply,
    },
    {
      title: "terraform output",
      task: terraformOutput,
    },
  ]);
