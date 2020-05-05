import { Context } from "./types";
const title = "Ensure region is set";

const task = ({ flags }: Context) => {
  const region = flags.region as string | undefined;
  if (region === undefined) {
    throw new Error();
  }
};

export { title, task };
