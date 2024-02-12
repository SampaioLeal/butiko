import { parseArgs } from "deno/cli/mod.ts";
import { buildResources, parseBuildArgs } from "./commands/build.ts";
import { ButikoError } from "./errors.ts";

const args = parseArgs(Deno.args);

try {
  switch (args._[0]) {
    case "build":
      parseBuildArgs(args);
      await buildResources(args._[1] as string);
      break;

    default:
      // TODO: run help command
      break;
  }
} catch (error) {
  if (error instanceof ButikoError) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  Deno.exit(1);
}
