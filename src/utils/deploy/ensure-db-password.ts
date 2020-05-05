import { Context } from "./types";

export const title = "Ensure database password has been chosen";

export const task = async (ctx: Context) => {
  const dbPassword = ctx.flags.dbPassword;
  if (!dbPassword) throw new Error("a db password must be chosen");
  // @ts-ignore
  ctx.rds = {
    ...(ctx.rds ?? {}),
    databasePassword: dbPassword,
  };
};
