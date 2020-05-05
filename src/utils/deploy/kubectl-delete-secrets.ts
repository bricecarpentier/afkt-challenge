import { Context } from "./types";
import { unlink } from "fs-extra";
import { join } from "path";

export const title = "Deleting secret file";

export const task = async (ctx: Context) => {
  const { k8sDir } = ctx;
  if (k8sDir === undefined) throw new Error("k8s directory not available");
  await unlink(join(k8sDir, "secret.yaml"));
};
