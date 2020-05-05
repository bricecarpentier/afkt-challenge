import { exec } from "child_process";
import { join } from "path";
import { promisify } from "util";

import { writeJSON } from "fs-extra";
import * as Listr from "listr";
import filterEnv from "../filter-env";
import { Context } from "./types";

const execp = promisify(exec);

export const title = "Provision EKS";

const extract = (ctx: Context) => {
  const { terraformDir } = ctx;
  if (terraformDir === undefined)
    throw new Error("terraform dir not available");
  const terraformEksDir = join(terraformDir, "eks");
  if (terraformEksDir === undefined)
    throw new Error("terraform/eks dir not available ");
  const region = ctx.flags.region as string;

  return { terraformEksDir: terraformEksDir, region };
};

const terraformInit = async (ctx: Context) => {
  const { terraformEksDir, region } = extract(ctx);

  await execp("terraform init", {
    cwd: terraformEksDir,
    env: filterEnv({ ...process.env, AWS_REGION: region }),
  });
};

const prepareTfVars = async (ctx: Context) => {
  const { terraformEksDir } = extract(ctx);
  const varFile = join(terraformEksDir, "terraform.tfvars.json");
  const { vpc } = ctx;
  await writeJSON(varFile, {
    cluster_name: vpc?.clusterName,
    private_subnets: vpc?.privateSubnets,
    vpc_id: vpc?.vpcId,
  });
};

const firstTerraformApply = async (ctx: Context) => {
  const { terraformEksDir, region } = extract(ctx);

  try {
    await execp("terraform apply -auto-approve", {
      cwd: terraformEksDir,
      env: filterEnv({ ...process.env, AWS_REGION: region }),
    });
  } catch (error) {
    // we expect this call to fail because of a out of date kubeconfig
  }
};

const updateKubeconfig = async (ctx: Context) => {
  const { region } = extract(ctx);
  await execp(
    `aws eks --region ${region} update-kubeconfig --name ${ctx.vpc?.clusterName}`,
    {
      env: filterEnv({ ...process.env, AWS_REGION: region }),
    }
  );
};

const secondTerraformApply = async (ctx: Context) => {
  const { terraformEksDir, region } = extract(ctx);

  await execp("terraform apply -auto-approve", {
    cwd: terraformEksDir,
    env: filterEnv({ ...process.env, AWS_REGION: region }),
  });
};

const terraformOutput = async (ctx: Context) => {
  const { terraformEksDir } = extract(ctx);
  const stdout = (
    await execp("terraform output -json", {
      cwd: terraformEksDir,
      env: filterEnv(process.env),
    })
  ).stdout;
  const output = JSON.parse(stdout);
  ctx.eks = {
    sgId: output.sg_id.value,
  };
};

export const task = () =>
  new Listr([
    { title: "terraform init", task: terraformInit },
    { title: "prepare tfvars", task: prepareTfVars },
    {
      title: "terraform apply (this will take about 10 minutes)",
      task: firstTerraformApply,
    },
    { title: "update kubeconfig", task: updateKubeconfig },
    {
      title: "terraform apply again (this should be shorter)",
      task: secondTerraformApply,
    },
    {
      title: "terraform output",
      task: terraformOutput,
    },
  ]);
