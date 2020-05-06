import { Command, flags } from "@oclif/command";
import * as Listr from "listr";
import * as deployTasks from "../utils/deploy/";

export default class Deploy extends Command {
  static description = "Deploy infrastructure";

  static examples = [
    `$ aha deploy
`,
  ];

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    // name: flags.string({ char: "n", description: "name to print" }),
    // flag with no value (-f, --force)
    // force: flags.boolean({ char: "f" }),
    region: flags.string({
      description:
        "aws region to use. Defaults to AWS_REGION or DEFAULT_AWS_REGION",
      default: process.env.AWS_REGION ?? process.env.DEFAULT_AWS_REGION,
    }),
    dbPassword: flags.string({
      description: "master password for the rds database",
      required: true,
    }),
  };

  static args = [{ name: "domainName" }];

  async run() {
    const { args, flags } = this.parse(Deploy);
    const tasks = new Listr([
      deployTasks.ensure,
      deployTasks.terraform,
      deployTasks.kubectl,
      deployTasks.postProcess,
    ]);
    const ctx = { cmd: this, args, flags };
    try {
      await tasks.run(ctx);
    } catch (error) {
      this.exit(1);
    }
  }
}
