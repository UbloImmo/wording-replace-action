import type { ItemOrNonEmptyArr, NonEmptyArr } from "./global.types";
import type { WordMatch } from "./match.types";
import type { WordReplacement } from "./replacement.types";
import type { AliasVariant, AliasVariantMap } from "./variant.types";

/**
 * A single alias that defines one or more word matches to match against and a single replacement to use if matched
 */
export type Alias = {
  /**
   * One or more words to match against all messages
   */
  match: ItemOrNonEmptyArr<WordMatch>;
  /**
   * A single word to use if any matches in the aliases was found in a message
   */
  replace: WordReplacement;
};

export interface ParsedAlias extends Alias {
  variants: NonEmptyArr<AliasVariant>;
  variantMap: AliasVariantMap;
  maxMatchLength: number;
}

/**
 * Collection of aliases to use when replacing messages
 */
export type AliasCollection = Alias[];

/**
 * Input object containing a collection of aliases
 */
export interface AliasInput {
  /**
   * Collection of aliases to use when replacing messages
   */
  aliases: AliasCollection;
}

export type ParsedAliasCollection = ParsedAlias[];

export type AliasData = {
  sourceAliases: AliasCollection;
  parsedAliases: ParsedAliasCollection;
  aliasMap: AliasVariantMap;
};
