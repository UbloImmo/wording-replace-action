import type { AliasMatcher } from "./match.types";

/**
 * A single word
 */
export type Word = string;

/**
 * A word's gender
 *
 * Either `f`: feminine
 * Or `m`: masculine
 */
export type WordGender = "f" | "m";

/**
 * A word's number
 *
 * Either `plural` or `singular`
 */
export type WordNumber = "plural" | "singular";

export type WordAttributes = {
  gender: WordGender;
  number: WordNumber;
};

export type WordData = WordAttributes & {
  word: Word;
};
