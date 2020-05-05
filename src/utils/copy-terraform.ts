import { lstat } from "fs";
import { promisify } from "util";
import { extname, join } from "path";
import { copy } from "fs-extra";

const stat = promisify(lstat);

const filter = async (src: string) => {
  const stats = await stat(src);
  const isDirectory = await stats.isDirectory();
  const isTfFile = extname(src) === ".tf";
  return isDirectory || isTfFile;
};

const copyTerraform = async (dest: string) => {
  const terraformDir = join(__dirname, "..", "..", "templates", "terraform");
  await copy(terraformDir, dest, { filter });
};

export default copyTerraform;
