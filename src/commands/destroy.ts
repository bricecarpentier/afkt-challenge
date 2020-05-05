import { Command, flags } from "@oclif/command";
import * as Listr from "listr";
import * as destroyTasks from "../utils/destroy/";

export default class Destroy extends Command {
  static description = "Destroy infrastructure and release resources";

  static examples = [
    `$ aha destroy
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
  };

  static args = [];

  async run() {
    const { args, flags } = this.parse(Destroy);
    const tasks = new Listr([
      destroyTasks.ensureWorkDir,
      destroyTasks.destroyLoadBalancer,
      destroyTasks.destroyCert,
      destroyTasks.destroyRds,
      destroyTasks.destroyEks,
      destroyTasks.destroyVpc,
    ]);
    const ctx = { cmd: this, args, flags };
    try {
      await tasks.run(ctx);
    } catch (error) {
      this.exit(1);
    }

    // const name = flags.name || "world";
    // this.log(`hello ${name} from ./src/commands/hello.ts`);
    // if (args.file && flags.force) {
    //   this.log(`you input --force and --file: ${args.file}`);
    // }
  }
}
