import type { API } from "./api.types";
import type { SpacyDependency } from "./spacy.types";
import type { Word, WordGender, WordNumber } from "./word.types";

export type WordReplacement = {
  singular: Word;
  plural: Word;
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
