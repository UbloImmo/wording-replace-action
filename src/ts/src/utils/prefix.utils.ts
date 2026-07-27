import {
  isNumber,
  isString,
  type Nullable,
  type Optional,
} from "@ubloimmo/front-util";
import {
  PLURAL_F_PREFIXES,
  PLURAL_M_PREFIXES,
  PREFIXES,
  SHORT_PREFIX_MATCHERS,
  SINGULAR_F_PREFIXES,
  SINGULAR_M_PREFIXES,
} from "../constants/prefix.constants";
import type { API } from "../types/api.types";
import type { NonEmptyArr } from "../types/global.types";
import type { WordMatch } from "../types/match.types";
import type { Prefix } from "../types/prefix.types";
import type { ReplacementItem } from "../types/replacement.types";
import type { Word, WordData, WordNumber } from "../types/word.types";
import type { AliasLogger } from "./log.utils";
import {
  clone,
  matchCase,
  normalize,
  toLowerCase,
  toTrimmed,
} from "./string.utils";
import type { AliasVariant } from "../types/variant.types";

export function needsShortPrefix(word: Word) {
  const firstLetter = toTrimmed(toLowerCase(word))[0];
  if (!firstLetter) return false;
  return SHORT_PREFIX_MATCHERS.has(firstLetter);
}

export function addPrefixes(word: Word, prefixes: Prefix[]): NonEmptyArr<Word> {
  return [
    word,
    // ...prefixes.map((item) => {
    //   const prefix =
    //     item.shortPrefix?.length && needsShortPrefix(word)
    //       ? item.shortPrefix
    //       : item.prefix;
    //   return `${prefix}${word}`;
    // }),
  ];
}

export function getMatchPrefixes(
  match: Pick<WordMatch, "gender">
): Record<WordNumber, NonEmptyArr<Prefix>> {
  const isMasculine = match.gender === "m";
  return {
    plural: isMasculine ? PLURAL_M_PREFIXES : PLURAL_F_PREFIXES,
    singular: isMasculine ? SINGULAR_M_PREFIXES : SINGULAR_F_PREFIXES,
  };
}

export function replaceDirectDet(
  det: API.RelatedWord,
  variant: AliasVariant,
  logger: AliasLogger
): Nullable<ReplacementItem> {
  const matchPrefixes = PREFIXES[variant.match.gender][variant.match.number];
  const replacementPrefixes =
    PREFIXES[variant.replace.gender][variant.replace.number];

  let replacementPrefix: Optional<Prefix>;
  let matchedPrefix: Optional<Prefix>;
  let matchedShortPrefix = false;
  for (let i = 0; i < matchPrefixes.length; i++) {
    const mPrefix = matchPrefixes[i];
    const rPrefix = replacementPrefixes[i];
    if (!mPrefix || !rPrefix) continue;
    const isMatchLongPrefix = normalize(mPrefix.prefix) === normalize(det.word);
    if (isMatchLongPrefix) {
      matchedPrefix = mPrefix;
      replacementPrefix = rPrefix;
      break;
    }
    const isMatchShortPrefix =
      isString(mPrefix.shortPrefix) &&
      normalize(mPrefix.shortPrefix) === normalize(det.word);
    if (isMatchShortPrefix) {
      matchedShortPrefix = true;
      matchedPrefix = mPrefix;
      replacementPrefix = rPrefix;
      break;
    }
  }

  logger.debug({ det: det });
  if (!replacementPrefix || !matchedPrefix) {
    logger.error("Missing prefix in data");
    return null;
  }
  const replaceWithShortPrefix =
    !!replacementPrefix.shortPrefix && needsShortPrefix(variant.replace.word);
  const replacement = replaceWithShortPrefix
    ? replacementPrefix.shortPrefix!
    : replacementPrefix.prefix;

  logger.debug({ replacementDet: replacement });

  // do not attempt replace if we end up with the same det
  if (normalize(replacement) === normalize(det.word)) return null;

  let eatRightSpaceCount: number;
  let appendRightSpace: boolean;

  const matchEndsWithApostrophe = normalize(det.word).endsWith("'");
  const replaceEndsWithApostrophe = normalize(replacement).endsWith("'");

  // both the same, no need to eat nor add spaces
  if (matchEndsWithApostrophe === replaceEndsWithApostrophe) {
    eatRightSpaceCount = 0;
    appendRightSpace = false;
  }
  // "l'" -> "la": add a space right
  else if (matchEndsWithApostrophe) {
    eatRightSpaceCount = 0;
    appendRightSpace = true;
  }
  // "la" -> "l'": remove a space right
  else {
    eatRightSpaceCount = 1;
    appendRightSpace = false;
  }

  const startIndex = det.position;
  const endIndex = startIndex + det.word.length + eatRightSpaceCount;
  let replaceWord = matchCase(det.word, replacement);
  if (appendRightSpace) {
    replaceWord += " ";
  }

  return {
    replace: {
      word: det.word,
      startIndex,
      endIndex,
    },
    with: replaceWord,
  };
}
