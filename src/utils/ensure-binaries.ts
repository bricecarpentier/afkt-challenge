import { exec } from "child_process";
import { promisify } from "util";

const execp = promisify(exec);

const ensureBinary = async (name: string) => {
  try {
    const r = await execp(`which ${name}`);
    return [name, true];
  } catch (error) {
    return [name, false];
  }
};

const ensureBinaries = async (...names: string[]) => {
  const commands = await Promise.all(names.map(ensureBinary));
  const missingCommands = commands.filter(([, available]) => !available);
  return missingCommands.map(([name]) => name);
};

export default ensureBinaries;
