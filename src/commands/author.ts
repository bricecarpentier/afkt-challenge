import { Command } from "@oclif/command";
// @ts-ignore
import { think, eyes } from "cowsay";

export default class Author extends Command {
  static description = "Hi!";
  static examples = [
    `$ aha author
`,
  ];

  static args = [];

  async run() {
    this.log(
      think({
        text: "Hey there, I'm Brice!",
        f: "eyes",
      })
    );
  }
}
