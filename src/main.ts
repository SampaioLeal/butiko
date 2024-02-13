import { buildResources } from "./commands/build.ts";
import { ButikoError } from "./errors.ts";
import {
  Command,
  CompletionsCommand,
  // DenoLandProvider,
  HelpCommand,
  // UpgradeCommand,
} from "cliffy/command/mod.ts";

const cmd = new Command()
  .name("butiko")
  .version("0.1.0")
  .description(
    "Build kubernetes resources faster by reusing manifests, set namespace easily and replacing variables",
  )
  .meta("deno", Deno.version.deno)
  .meta("v8", Deno.version.v8)
  .meta("typescript", Deno.version.typescript)
  .example("Build resources", "butiko build ./path/to/manifests/butiko.yaml")
  /**
   * Build Command
   */
  .command(
    "build",
    "Parse butiko manifest to return transformed kubernetes resources",
  )
  .arguments("<manifest:file>")
  .action(buildResources)
  /** Default commands */
  .command("help", new HelpCommand().global())
  .command("completions", new CompletionsCommand());
// Watching https://github.com/c4spar/deno-cliffy/issues/302
// .command(
//   "upgrade",
//   new UpgradeCommand({
//     main: "src/main.ts",
//     args: ["--allow-net"],
//     provider: new DenoLandProvider(),
//   }),
// )

try {
  cmd.parse(Deno.args);
} catch (error) {
  if (error instanceof ButikoError) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  Deno.exit(1);
}
