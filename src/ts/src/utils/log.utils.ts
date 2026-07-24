import {
  isObject,
  isString,
  isUndefined,
  Logger,
  objectKeys,
  type AsyncFn,
  type DeepKeyOfType,
  type LoggerFn,
} from "@ubloimmo/front-util";
import dedent from "ts-dedent";
import type { RuntimeArgs } from "../types/args.types";
import { History } from "./history.utils";
import { isNonEmptyStr } from "./predicate.utils";

const LOGGER_PREFIX = "Aliases";

export type AliasLogger = Logger & {
  line(width?: number): void;
  writeHistory: AsyncFn;
};

export function getLogger(args: RuntimeArgs): AliasLogger {
  const logger = Logger({
    hideDebug: !args.verbose,
    hideLogs: !args.verbose,
  });
  const history = new History(args);

  function line(width = 80, char = "—") {
    return char.repeat(width);
  }

  for (const k in logger) {
    if (k === "config") continue;
    const key = k as keyof Logger & DeepKeyOfType<Logger, LoggerFn>;
    const baseFn = logger[key];

    logger[key] = (message: unknown, name?: string) => {
      // if name is missing & message is single property object, use its only key as name
      if (!name?.length && isObject(message)) {
        const keys = Object.keys(message);
        if (keys.length === 1 && !isUndefined(keys[0])) {
          const key = keys[0];
          name = String(key);
          if (key in message) {
            message = (message as Record<string, unknown>)[key];
          }
        }
      }

      const msg = isString(message) ? dedent(message).trim() : message;
      const n = isNonEmptyStr(name)
        ? `${LOGGER_PREFIX}::${name}`
        : LOGGER_PREFIX;

      history.write(key, msg, n);

      baseFn(msg, n);
    };
  }
  return {
    ...logger,
    line(width = 80) {
      // eslint-disable-next-line no-console
      console.log(`\n${line(width)}\n`);
    },
    writeHistory() {
      return history.writeToFile();
    },
  };
}
