import { homedir } from "os";
import { join } from "path";
import { ensureDir } from "fs-extra";
import { Context } from "../deploy/types";

export const title = "Ensure working directory exists";

export const task = async (ctx: Context) => {
  const home = homedir();
  const configDir = join(home, ".aha");
  await ensureDir(configDir);
  ctx.configDir = configDir;
};
