import * as Listr from "listr";
import * as ensureWorkDir from "../common/ensure-work-dir";
import * as ensureRequiredCommands from "./ensure-required-commands";
import * as ensureRegion from "./ensure-region";
import * as ensureHostedZone from "./ensure-hosted-zone";
import * as ensureDbPassword from "./ensure-db-password";

export const title = "Firing engines (and checking asumptions)";

export const task = () =>
  new Listr([
    ensureRequiredCommands,
    ensureRegion,
    ensureWorkDir,
    ensureHostedZone,
    ensureDbPassword,
  ]);
