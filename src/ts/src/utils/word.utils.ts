import type { Alias } from "../types/alias.types";
import type { NonEmptyArr } from "../types/global.types";
import type { WordMatch, WordMatchData } from "../types/match.types";
import type {
  Word,
  WordAttributes,
  WordData,
  WordGender,
  WordNumber,
} from "../types/word.types";
import { toArray, toNonEmptyArray } from "./array.utils";

export function formatWordData(
  word: Word,
  gender: WordGender,
  number: WordNumber
): WordData {
  return {
    word,
    gender,
    number,
  };
}

export function formatWordMatchData(
  word: Word,
  { gender, ignore, ignoreAsAdjective = false }: WordMatch,
  number: WordNumber
): WordMatchData {
  return {
    word,
    gender,
    number,
    ignore: toArray(ignore).flatMap((item) => toNonEmptyArray(item[number])),
    ignoreAsAdjective,
  };
}
