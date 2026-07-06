import type { AliasLogger } from "../../utils/log.utils";
import type { POCatalog } from "../../types/po.types";
import { objectKeys } from "@ubloimmo/front-util";
import { time } from "../../utils/timing.utils";
import { FORMATTER_INSTANCE } from "../../constants/po.constants";

export async function parsePOCatalog(
  catalogContents: string,
  logger: AliasLogger
): Promise<POCatalog> {
  logger.info("Parsing translation catalog contents");
  const catalog = await time(
    logger,
    FORMATTER_INSTANCE.parse,
    catalogContents,
    {
      locale: "fr",
      sourceLocale: "fr",
      filename: "",
    }
  );
  logger.info(`Parsed ${objectKeys(catalog).length} entries in catalog`);
  return catalog;
}
