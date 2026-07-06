import { parseArgs } from "util";
import { ARGS_CONFIG, DEFAULT_ARGS } from "../constants/args.constants";
import type { Args } from "../types/args.types";

export function parseInputArgs() {
  const args = parseArgs({
    args: Bun.argv,
    ...ARGS_CONFIG,
  });
  const parsedArgs: Required<Args> = Object.assign(
    {},
    DEFAULT_ARGS,
    args.values
  );
  return parsedArgs;
}
