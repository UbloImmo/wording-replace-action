import { readFile } from "node:fs/promises";
import type { AliasCollection } from "../../types/alias.types";
import type { AliasLogger } from "../../utils/log.utils";
import { isArray, isObject } from "@ubloimmo/front-util";
import { isAliasCollection } from "../../utils/predicate.utils";

function extractCollectionFromInput(input: unknown): AliasCollection {
  if (!isObject(input))
    throw new Error(
      "Input JSON must be an object containg an `aliases` property."
    );
  if (!("aliases" in input))
    throw new Error(
      "Input JSON must be an object containg an `aliases` property."
    );
  if (!isArray(input.aliases))
    throw new Error(
      "Input JSON's `aliases` property must be an array of aliases."
    );
  if (!isAliasCollection(input.aliases))
    throw new Error("Input JSON is malformed");
  return input.aliases;
}

export async function readAliasCollection(
  filePath: string,
  logger: AliasLogger
): Promise<AliasCollection> {
  try {
    if (!filePath.endsWith(".json"))
      throw new Error("Input file must be JSON.");
    const contents = await readFile(filePath, { encoding: "utf-8" });
    if (!contents.length) throw new Error("Input file is empty.");
    const input = JSON.parse(contents);
    return extractCollectionFromInput(input);
  } catch (e) {
    logger.error(e, "readAliasCollection");
    return [];
  }
}
