import { parseAliasData } from "./lib/alias/alias.parser";
import { readAliasCollection } from "./lib/alias/alias.reader";
import { replacePOCatalogEntries } from "./lib/alias/alias.replacer";
import { DB_POOL } from "./lib/db/db.client";
import { parsePOCatalog } from "./lib/po/po.parser";
import { readPOCatalog } from "./lib/po/po.reader";
import { writePOCatalog } from "./lib/po/po.writer";
import type { Args } from "./types/args.types";
import { parseInputArgs } from "./utils/args.utils";
import { type AliasLogger, getLogger } from "./utils/log.utils";
import { time } from "./utils/timing.utils";

async function read(args: Required<Args>, logger: AliasLogger) {
  const [aliasesInput, messagesInput] = await Promise.all([
    readAliasCollection(args.aliases, logger),
    readPOCatalog(args.input, logger),
  ]);

  const aliases = parseAliasData(aliasesInput, logger);
  const catalog = await parsePOCatalog(messagesInput, logger);

  return {
    aliases,
    catalog,
  };
}

async function main() {
  const start = performance.now();
  const args = parseInputArgs();
  const logger = getLogger(args);

  const { aliases, catalog } = await time(logger, read, args, logger);

  const replacedCatalog = await replacePOCatalogEntries(
    catalog,
    aliases,
    logger
  );

  await writePOCatalog(replacedCatalog, "fr", logger, args);

  logger.info("Done");

  await DB_POOL.end();

  const end = performance.now();

  const duration = end - start;
  logger.debug(`main execution took ${duration}ms`);

  if (args.verbose) {
    await logger.writeHistory();
  }
  return;
}

await main();
