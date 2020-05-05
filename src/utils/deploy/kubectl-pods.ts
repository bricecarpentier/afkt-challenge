import * as Mustache from "mustache";
import { Context } from "./types";
import { readFile, writeFile } from "fs-extra";
import { join } from "path";

export const title = "Creating the pods file";

export const task = async (ctx: Context) => {
  const { k8sDir } = ctx;
  if (k8sDir === undefined) throw new Error("k8s directory not available");
  const template = await readFile(
    join(
      __dirname,
      "..",
      "..",
      "..",
      "templates",
      "k8s",
      "wpapp.yaml.mustache"
    ),
    "utf8"
  );

  const rendered = Mustache.render(template, {
    domainName: ctx.cert?.domainName,
  });

  const configFile = join(k8sDir, "wpapp.yaml");
  await writeFile(configFile, rendered);
};
