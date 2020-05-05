import { exec } from "child_process";
import { join } from "path";
import { promisify } from "util";
import filterEnv from "../filter-env";
import { Context } from "../deploy/types";
import * as ensureWorkDir from "../common/ensure-work-dir";

const execp = promisify(exec);

const runTerraformDestroy = async (directory: string) => {
  const command = "terraform destroy -auto-approve";
  await execp(command, { env: filterEnv(process.env), cwd: directory });
};

export { ensureWorkDir };

// this is necessary to release the certificate
export const destroyLoadBalancer = {
  title: "Destroying load balancer",
  task: async (ctx: Context) => {
    if (ctx.configDir === undefined) throw new Error("configDir is missing");
    const command = "kubectl delete service wpapp-service";
    await execp(command, { env: filterEnv(process.env) });
  },
};

export const destroyCert = {
  title: "Destroying certificate",
  task: async (ctx: Context) => {
    if (ctx.configDir === undefined) throw new Error("configDir is missing");
    await runTerraformDestroy(join(ctx.configDir, "terraform", "cert"));
  },
};

export const destroyRds = {
  title: "Destroying db cluster",
  task: async (ctx: Context) => {
    if (ctx.configDir === undefined) throw new Error("configDir is missing");
    // database_password is actually irrelevant, it's just required because of
    // how the variables files is defined
    const command =
      "terraform destroy -auto-approve -var=database_password=toto";
    const directory = join(ctx.configDir, "terraform", "db");
    await execp(command, { env: filterEnv(process.env), cwd: directory });
  },
};

export const destroyEks = {
  title: "Destroying eks cluster",
  task: async (ctx: Context) => {
    if (ctx.configDir === undefined) throw new Error("configDir is missing");
    await runTerraformDestroy(join(ctx.configDir, "terraform", "eks"));
  },
};

export const destroyVpc = {
  title: "Destroying vpc",
  task: async (ctx: Context) => {
    if (ctx.configDir === undefined) throw new Error("configDir is missing");
    await runTerraformDestroy(join(ctx.configDir, "terraform", "vpc"));
  },
};
