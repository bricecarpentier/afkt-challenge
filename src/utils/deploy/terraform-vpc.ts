import { exec } from "child_process";
import { join } from "path";
import { promisify } from "util";

import * as Listr from "listr";
import filterEnv from "../filter-env";
import { Context } from "./types";

const execp = promisify(exec);

export const title = "Provision VPC";

const extract = (ctx: Context) => {
  const { terraformDir } = ctx;
  if (terraformDir === undefined)
    throw new Error("terraform dir not available");
  const terraformVpcDir = join(terraformDir, "vpc");
  if (terraformVpcDir === undefined)
    throw new Error("terraform/vpc dir not available ");
  const region = ctx.flags.region as string;

  return { terraformVpcDir, region };
};

const terraformInit = async (ctx: Context) => {
  const { terraformVpcDir, region } = extract(ctx);

  await execp("terraform init", {
    cwd: terraformVpcDir,
    env: filterEnv({ ...process.env, AWS_REGION: region }),
  });
};

const terraformApply = async (ctx: Context) => {
  const { terraformVpcDir, region } = extract(ctx);

  await execp("terraform apply -auto-approve", {
    cwd: terraformVpcDir,
    env: filterEnv({ ...process.env, AWS_REGION: region }),
  });
};

const terraformOutput = async (ctx: Context) => {
  const { terraformVpcDir } = extract(ctx);
  const { stdout } = await execp("terraform output -json", {
    cwd: terraformVpcDir,
    env: filterEnv(process.env),
  });
  const output = JSON.parse(stdout);
  ctx.vpc = {
    vpcId: output.vpc_id.value,
    privateSubnets: output.private_subnets.value,
    clusterName: output.cluster_name.value,
  };
};

export const task = () =>
  new Listr([
    { title: "terraform init", task: terraformInit },
    {
      title: "terraform apply (this can take up to 5 minutes)",
      task: terraformApply,
    },
    {
      title: "terraform output",
      task: terraformOutput,
    },
  ]);
