import type { ItemOrNonEmptyArr, NonEmptyArr } from "./global.types";
import type { WordMatch } from "./match.types";
import type { WordReplacement } from "./replacement.types";
import type { AliasVariant, AliasVariantMap } from "./variant.types";

export type Alias = {
  match: ItemOrNonEmptyArr<WordMatch>;
  replace: WordReplacement;
};

export interface ParsedAlias extends Alias {
  variants: NonEmptyArr<AliasVariant>;
  variantMap: AliasVariantMap;
  maxMatchLength: number;
}

export type AliasCollection = Alias[];

export type ParsedAliasCollection = ParsedAlias[];

export type AliasData = {
  sourceAliases: AliasCollection;
  parsedAliases: ParsedAliasCollection;
  aliasMap: AliasVariantMap;
};
