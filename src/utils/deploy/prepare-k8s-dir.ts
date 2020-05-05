import { Context } from "./types";
import { join } from "path";
import { mkdirp } from "fs-extra";

export const title = "Ensure k8s dir exists";

export const task = async (ctx: Context) => {
  const { configDir } = ctx;
  if (configDir === undefined)
    throw new Error("Config directory not available");
  const k8sDir = join(configDir, "k8s");
  await mkdirp(k8sDir);
  ctx.k8sDir = k8sDir;
};
