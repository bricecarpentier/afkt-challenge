import { exec } from "child_process";
import { join } from "path";
import { promisify } from "util";

import * as Listr from "listr";
import filterEnv from "../filter-env";
import { Context } from "./types";
import { writeJSON } from "fs-extra";

const execp = promisify(exec);

export const title = "Provision RDS";

const extract = (ctx: Context) => {
  const { terraformDir } = ctx;
  if (terraformDir === undefined)
    throw new Error("terraform dir not available");
  const terraformRdsDir = join(terraformDir, "db");
  if (terraformRdsDir === undefined)
    throw new Error("terraform/db dir not available ");
  const region = ctx.flags.region as string;

  return { terraformRdsDir, region };
};

const terraformInit = async (ctx: Context) => {
  const { terraformRdsDir, region } = extract(ctx);

  await execp("terraform init", {
    cwd: terraformRdsDir,
    env: filterEnv({ ...process.env, AWS_REGION: region }),
  });
};

const prepareTfVars = async (ctx: Context) => {
  const { terraformRdsDir } = extract(ctx);
  const varFile = join(terraformRdsDir, "terraform.tfvars.json");
  const { vpc, eks } = ctx;
  await writeJSON(varFile, {
    private_subnets: vpc?.privateSubnets,
    vpc_id: vpc?.vpcId,
    sg_id: eks?.sgId,
  });
};

const terraformApply = async (ctx: Context) => {
  const { terraformRdsDir, region } = extract(ctx);
  const dbPassword = ctx.rds?.databasePassword;
  await execp("terraform apply -auto-approve", {
    cwd: terraformRdsDir,
    env: {
      ...filterEnv({ ...process.env, AWS_REGION: region }),
      TF_VAR_database_password: dbPassword,
    },
  });
};

const terraformOutput = async (ctx: Context) => {
  const { terraformRdsDir } = extract(ctx);
  const { stdout } = await execp("terraform output -json", {
    cwd: terraformRdsDir,
    env: filterEnv(process.env),
  });
  const output = JSON.parse(stdout);
  ctx.rds = {
    databasePassword: ctx.rds?.databasePassword ?? "",
    databaseEndpoint: output.db_endpoint as string,
    databaseUsername: output.db_username as string,
    databaseName: output.db_name as string,
    databasePort: output.db_port as string,
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
