import { parse } from "@typescript-eslint/parser";
import type {
  Alias,
  AliasCollection,
  AliasData,
  ParsedAlias,
  ParsedAliasCollection,
} from "../../types/alias.types";
import type { NonEmptyArr } from "../../types/global.types";
import type { AliasVariant, AliasVariantMap } from "../../types/variant.types";
import { toNonEmptyArray } from "../../utils/array.utils";
import { derivePrefixVariants } from "../../utils/variant.utils";
import type { AliasLogger } from "../../utils/log.utils";

function parseAlias(alias: Alias): ParsedAlias {
  const variants = [] as unknown as NonEmptyArr<AliasVariant>;

  const matches = toNonEmptyArray(alias.match);

  for (const match of matches) {
    derivePrefixVariants(variants, match, alias.replace);
  }

  // sort variants from longest to shortest
  // this ensures we try to match the longest variant before the shortest when replacing aliases in catalog
  variants.sort((a, b) => b.match.word.length - a.match.word.length);
  let maxMatchLength = 0;
  const variantMap: AliasVariantMap = new Map(
    variants.map((variant) => {
      const wordLength = variant.match.word.length;
      if (variant.match.word.length > maxMatchLength) {
        maxMatchLength = wordLength;
      }
      return [variant.match.word, variant];
    })
  );

  return {
    ...alias,
    variants,
    variantMap,
    maxMatchLength,
  };
}

function buildAliasMap(
  parsedCollection: ParsedAliasCollection,
  logger: AliasLogger
): AliasVariantMap {
  const variants: AliasVariant[] = [];

  // flatten all variants
  for (const alias of parsedCollection) {
    variants.push(...alias.variants);
  }

  // sort -> longest first
  variants.sort((a, b) => b.match.word.length - a.match.word.length);

  // insert in map in order
  const map: AliasVariantMap = new Map();

  for (const variant of variants) {
    if (map.has(variant.match.word)) {
      logger.error(`Duplicate match found: ${variant.match.word}`);
    }
    map.set(variant.match.word, variant);
  }

  return map;
}

function parseAliasCollection(
  aliasCollection: AliasCollection
): ParsedAliasCollection {
  return aliasCollection
    .map(parseAlias)
    .sort((a, b) => b.maxMatchLength - a.maxMatchLength);
}

export function parseAliasData(
  sourceAliases: AliasCollection,
  logger: AliasLogger
): AliasData {
  const parsedAliases = parseAliasCollection(sourceAliases);
  const aliasMap = buildAliasMap(parsedAliases, logger);
  return {
    sourceAliases,
    parsedAliases,
    aliasMap,
  };
}
