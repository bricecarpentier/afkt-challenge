import { exec } from "child_process";
import { promisify } from "util";
import { Context } from "./types";
import filterEnv from "../filter-env";
import { dirname, join } from "path";
import { readdir } from "fs-extra";

const execp = promisify(exec);

export const title = "Apply";

const apply = async (file: string, options: { env: any; cwd?: string }) => {
  await execp(`kubectl apply -f ${file}`, options);
};

export const task = async (ctx: Context) => {
  const { k8sDir } = ctx;
  if (k8sDir === undefined) throw new Error("k8s directory is missing");
  const files = await readdir(k8sDir);
  const options = {
    env: filterEnv(process.env),
    cwd: ctx.k8sDir,
  };
  // This for-of-async pattern is not particularly recommended, but that is
  // mostly because it used to work very unreliably in previous versions of
  // babel and people mostly haven't noticed that it got better
  // I could have just used a Promise.all(files.map(...)) here, but I'm unsure
  // how kubectl (and the kubernetes api) would react
  for (const file of files) {
    await apply(join(k8sDir, file), options);
  }
};
