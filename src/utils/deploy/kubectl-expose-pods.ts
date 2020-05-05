import { join } from "path";
import { readFile, writeFile } from "fs-extra";
import * as Mustache from "mustache";

import { Context } from "./types";

export const title = "Creating the pod expose file";

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
      "service.yaml.mustache"
    ),
    "utf8"
  );

  const rendered = Mustache.render(template, {
    certArn: ctx.cert?.certArn,
  });

  const configFile = join(k8sDir, "service.yaml");
  await writeFile(configFile, rendered);
};
