import dedent from "ts-dedent";
import { toUpperCase } from "./string.utils";
import { isString } from "@ubloimmo/front-util";

import { writeFile } from "node:fs/promises";
import type { RuntimeArgs } from "../types/args.types";
import { isNonEmptyStr } from "./predicate.utils";

// const HISTORY_PATH

export class History {
  public readonly entries = new Map<number, string>();
  private readonly args: RuntimeArgs;

  constructor(args: RuntimeArgs) {
    this.args = args;
  }

  public write(messageType: string, message: unknown, name?: string) {
    const now = new Date(Date.now()).toISOString();

    const contentStr = isString(message) ? message : JSON.stringify(message);

    const entry = dedent`
${now} [${toUpperCase(messageType)}] ${isNonEmptyStr(name) ? `[${name}] ` : ""}${"=".repeat(20)}

${contentStr}`;

    const ts = performance.now();

    this.entries.set(ts, entry);
  }

  public async writeToFile() {
    let contents = "";
    for (const entry of this.entries.values()) {
      contents += entry;
      contents += "\n\n";
    }
    await writeFile(this.args.logTo, contents);
  }
}
