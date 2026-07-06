import type { AliasMatcher, WordMatchData } from "./match.types";
import type { Word, WordData } from "./word.types";

/**
 * A single variant of an alias
 */
export type AliasVariant = {
  match: WordMatchData;
  /**
   * @deprecated prefixes are now handled by spacy + morphalou
   */
  unprefixedMatch: WordMatchData;
  replace: WordData;
  /**
   * @deprecated prefixes are now handled by spacy + morphalou
   */
  unprefixedReplace: WordData;
};

export type AliasVariantMap = Map<Word, AliasVariant>;
