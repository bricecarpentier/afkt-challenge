import { exec } from "child_process";
import { promisify } from "util";
import { Context } from "./types";
import filterEnv from "../filter-env";
import { dirname } from "path";
import { readdir } from "fs-extra";

const execp = promisify(exec);

export const title = "Apply";

export const task = async (ctx: Context) => {
  const { k8sDir } = ctx;
  if (k8sDir === undefined) throw new Error("k8s directory is missing");
  const files = await readdir(k8sDir);
  throw new Error(files.join(","));
  await execp("kubectl apply", {
    env: filterEnv(process.env),
    cwd: ctx.k8sDir,
  });
};
