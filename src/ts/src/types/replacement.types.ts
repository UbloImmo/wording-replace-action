import type { Word, WordGender } from "./word.types";

/**
 * Defines a single word to use as replacement
 */
export type WordReplacement = {
  /**
   * Singular form of the replacement
   */
  singular: Word;
  /**
   * Plural form of the replacement
   */
  plural: Word;
  /**
   * Gender of the replacement
   */
  gender: WordGender;
};

export type WordPosition = {
  startIndex: number;
  endIndex: number;
  word: Word;
};

export type ReplacementItem = {
  replace: WordPosition;
  with: Word;
};
