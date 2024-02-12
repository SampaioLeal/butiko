// @deno-types="npm:@types/ramda"
import { keys, map } from "npm:ramda";
// @deno-types="npm:@types/lodash"
import _ from "npm:lodash";

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  value?.constructor === Object;

export function paths(obj: unknown, parentKey?: string) {
  let result: string[];

  if (Array.isArray(obj)) {
    let idx = 0;

    result = obj.flatMap((obj) => {
      return paths(obj, (parentKey || "") + "." + idx++);
    });
  } else if (isPlainObject(obj)) {
    result = keys(obj).flatMap((key) => {
      return map((subkey) => {
        return (parentKey ? parentKey + "." : "") + subkey;
      }, paths(obj[key], key));
    });
  } else {
    result = [];
  }

  return result.concat(parentKey || []);
}

export function getValue(obj: object, objPath: string) {
  return _.get(obj, objPath);
}

export function setValue<T extends object>(
  obj: T,
  objPath: string,
  value: unknown,
) {
  return _.set(obj, objPath, value) as T;
}
