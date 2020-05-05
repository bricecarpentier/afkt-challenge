import { lstat } from "fs";
import { promisify } from "util";
import { extname, join } from "path";
import { copy } from "fs-extra";
import { Context } from "./types";

const stat = promisify(lstat);

export const title = "Prepare terraform files";

const filter = async (src: string) => {
  const stats = await stat(src);
  const isDirectory = await stats.isDirectory();
  const isTfFile = extname(src) === ".tf";
  return isDirectory || isTfFile;
};

const copyTerraform = async (dest: string) => {
  const terraformDir = join(
    __dirname,
    "..",
    "..",
    "..",
    "templates",
    "terraform"
  );
  await copy(terraformDir, dest, { filter });
};

export const task = async (ctx: Context) => {
  const { configDir } = ctx;
  if (configDir === undefined)
    throw new Error("Config directory not available");
  const terraformDir = join(configDir, "terraform");
  await copyTerraform(terraformDir);
  ctx.terraformDir = terraformDir;
};
