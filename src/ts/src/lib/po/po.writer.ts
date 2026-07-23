import { FORMATTER_INSTANCE } from "../../constants/po.constants";
import type { RuntimeArgs } from "../../types/args.types";
import type { POCatalog } from "../../types/po.types";
import type { AliasLogger } from "../../utils/log.utils";
import { time } from "../../utils/timing.utils";
import { writeFileSafe } from "../../utils/file.utils";

export async function writePOCatalog(
  catalog: POCatalog,
  locale: string,
  logger: AliasLogger,
  args: RuntimeArgs
) {
  const poStr = await time(logger, FORMATTER_INSTANCE.serialize, catalog, {
    locale,
    sourceLocale: "fr",
    filename: "",
    existing: undefined,
  });

  await writeFileSafe(args.output, poStr);
}
