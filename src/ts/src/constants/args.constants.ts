import type { ParseArgsOptionsConfig, ParseArgsConfig } from "util";
import type { Args } from "../types/args.types";
import { resolve } from "node:path";

export const ARGS_OPTIONS: ParseArgsOptionsConfig = {
  aliases: {
    short: "a",
    type: "string",
  },
  input: {
    short: "i",
    type: "string",
  },
  output: {
    short: "o",
    type: "string",
  },
  verbose: {
    short: "v",
    type: "boolean",
  },
  logTo: {
    short: "l",
    type: "string",
  },
};

export const ARGS_CONFIG = {
  options: ARGS_OPTIONS,
  strict: true,
  allowPositionals: true,
} satisfies ParseArgsConfig;

export const DEFAULT_ARGS: Required<Args> = {
  input: resolve(__dirname, "..", "..", "..", "..", "input", "messages.po"),
  aliases: resolve(__dirname, "..", "..", "..", "..", "input", "aliases.json"),
  output: resolve(__dirname, "..", "..", "..", "..", "output", "messages.po"),
  logTo: resolve(__dirname, "..", "..", "..", "..", "output", "log.txt"),
  verbose: true,
};
