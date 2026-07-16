import type { ItemOrArr, ItemOrNonEmptyArr } from "./global.types";
import type { Word, WordData, WordGender } from "./word.types";

export type AliasMatcher = string;

export type WordMatchIgore = {
  /**
   * One or more singular forms of the word to match to ignore
   */
  singular: ItemOrNonEmptyArr<Word>;
  /**
   * One or more plural forms of the word to match to ignore
   *
   * @todo make it optional (default add s at the end)
   */
  plural: ItemOrNonEmptyArr<Word>;
};

/**
 * Matches one or more word forms for replacement
 */
export type WordMatch = {
  /**
   * One or more singular forms of the word or sentence to match against
   */
  singular: ItemOrNonEmptyArr<Word>;
  /**
   * One or more plural forms of the word or sentence to match against
   *
   * @todo make it optional (default add s at the end)
   */
  plural: ItemOrNonEmptyArr<Word>;
  /**
   * The gender of the word to match. Either `f` for feminine or `m` for masculine.
   */
  gender: WordGender;
  /**
   * Optional array of word forms to ignore
   *
   * @default []
   */
  ignore?: ItemOrArr<WordMatchIgore>;
  /**
   * French language uses a lot of common nouns as adjectives.
   * If set to `true`, the match will be ignored if it is determined to be used as an adjective in a sentence
   *
   * @default false
   */
  ignoreAsAdjective?: boolean;
};

export type WordMatchData = WordData & {
  ignore: AliasMatcher[];
  ignoreAsAdjective: boolean;
};
