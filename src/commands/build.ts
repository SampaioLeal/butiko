import { dirname, extname, parse, resolve } from "deno/path/mod.ts";
import {
  parse as parseYaml,
  stringify as stringifyYaml,
} from "deno/yaml/mod.ts";
import { ButikoManifest } from "../types.ts";
import * as dotenv from "deno/dotenv/mod.ts";
import { VariablesMap } from "../types.ts";
import { getValue, paths, setValue } from "../object_utils.ts";
import { Args } from "deno/cli/parse_args.ts";
import { ButikoError } from "../errors.ts";

async function readManifest<T extends object>(path: string) {
  const decoder = new TextDecoder();
  const file = await Deno.readFile(path);
  const stringData = decoder.decode(file);
  const manifest = parseYaml(stringData) as T;

  return manifest;
}

export async function buildResources(path: string) {
  const variables: VariablesMap = new Map();
  const resolvedPath = resolve(path);
  const parsedPath = parse(resolvedPath);

  if (!["butiko.yaml", "butiko.yml"].includes(parsedPath.base)) {
    throw new ButikoError("Invalid butiko.yaml file");
  }

  const manifest = await readManifest<ButikoManifest>(resolvedPath);

  /**
   * Variables Phase
   */

  for (const variableDef of manifest.variables) {
    if (!("path" in variableDef)) {
      variables.set(variableDef.name, variableDef.value);
      continue;
    }

    const resolvedVarsPath = resolve(dirname(resolvedPath), variableDef.path);

    if (extname(resolvedVarsPath) !== ".env") {
      throw new ButikoError("Invalid .env file");
    }

    const varsFromFile = await dotenv.load({
      envPath: resolvedVarsPath,
      export: false,
    });

    Object.entries(varsFromFile).forEach(([key, value]) => {
      variables.set(key, Number(value) || value);
    });
  }

  /**
   * Manifests Phase
   */

  const manifests: string[] = [];

  for (const importPath of manifest.imports) {
    let resource = await readManifest<Record<string, unknown>>(
      resolve(dirname(resolvedPath), importPath),
    );

    if (resource.metadata) {
      resource = setValue(resource, "metadata.namespace", manifest.namespace);
    }

    const resourcePaths = paths(resource);

    resourcePaths.forEach((path) => {
      const value = getValue(resource, path);

      if (typeof value !== "string") return;

      const toReplace: string[] = [];
      const newValue = value.replace(
        /\{{(.*?)}}/g,
        (match, p1) => {
          const varValue = variables.get(p1);

          if (typeof varValue === "string") {
            return varValue;
          } else if (
            typeof varValue === "object" || typeof varValue === "number"
          ) {
            toReplace.push(path);
            return match;
          } else {
            return match;
          }
        },
      );

      resource = setValue(resource, path, newValue);

      toReplace.forEach((path) => {
        const value = getValue(resource, path);
        const varName = value.match(/\{{(.*?)}}/)[1];
        const varValue = variables.get(varName);

        resource = setValue(resource, path, varValue);
      });
    });

    manifests.push(stringifyYaml(resource));
  }

  return console.log(manifests.join("\n---\n"));
}

export function parseBuildArgs(args: Args) {
  if (!args._[1] || typeof args._[1] !== "string") {
    throw new ButikoError("Invalid path to butiko.yaml file");
  }
}
