import { readFile } from "node:fs/promises";
import type { AliasCollection } from "../../types/alias.types";
import type { AliasLogger } from "../../utils/log.utils";
import { isArray, isObject } from "@ubloimmo/front-util";
import { isAliasCollection } from "../../utils/predicate.utils";

export async function readAliasCollection(
  filePath: string,
  logger: AliasLogger
): Promise<AliasCollection> {
  try {
    if (!filePath.endsWith(".json"))
      throw new Error("Input file must be JSON.");
    const contents = await readFile(filePath, { encoding: "utf-8" });
    if (!contents.length) throw new Error("Input file is empty.");
    const collection = JSON.parse(contents);
    if (!isArray(collection)) throw new Error("Input JSON must be an array.");
    if (!isAliasCollection(collection))
      throw new Error("Input JSON is malformed.");
    return collection;
  } catch (e) {
    logger.error(e, "readAliasCollection");
    return [];
  }
}
