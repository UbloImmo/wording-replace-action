import type { AliasLogger } from "../../utils/log.utils";
import { readFile } from "node:fs/promises";

export async function readPOCatalog(
  filePath: string,
  logger: AliasLogger
): Promise<string> {
  logger.info(`Reading translation catalog at path ${filePath}`);
  return readFile(filePath, { encoding: "utf-8" });
}
