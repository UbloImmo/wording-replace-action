import {
  capitalize,
  objectKeys,
  transformObject,
  type VoidFn,
} from "@ubloimmo/front-util";
import { isUppercase } from "./string.utils";
import type { NonEmptyArr } from "../types/global.types";
import type { Word, WordNumber } from "../types/word.types";
import { addPrefixes, getMatchPrefixes } from "./prefix.utils";
import type { Prefix } from "../types/prefix.types";
import { toNonEmptyArray } from "./array.utils";
import type { WordMatch } from "../types/match.types";
import type { WordReplacement } from "../types/replacement.types";
import type { AliasVariant } from "../types/variant.types";
import { formatWordData, formatWordMatchData } from "./word.utils";

/**
 * Derives a single alias variant with uppercase & capitalized variations
 * @param {AliasVariant} baseVariant - Base Alias variant to derive
 * @returns {NonEmptyArr<AliasVariant>} An array containing [base variant, uppercase derivation, capitalized derivation]
 */
export function deriveCaseVariant(
  baseVariant: AliasVariant
): NonEmptyArr<AliasVariant> {
  return [
    baseVariant,
    transformObject(baseVariant, ({ word, ...attrs }) => ({
      word: word.toUpperCase(),
      ...attrs,
    })) as AliasVariant,
    transformObject(baseVariant, ({ word, ...attrs }) => ({
      word: isUppercase(word) ? word : capitalize(word),
      ...attrs,
    })) as AliasVariant,
  ];
}

export function appendPrefixedVariants(
  appendVariant: VoidFn<
    [
      match: Word,
      unprefixedMatchWord: Word,
      replace: Word,
      unprefixedReplaceWord: Word,
      n: WordNumber,
    ]
  >,
  numberedMatches: Record<WordNumber, NonEmptyArr<Word>>,
  matchPrefixes: Record<WordNumber, NonEmptyArr<Prefix>>,
  numberedPrefixedReplacements: Record<WordNumber, NonEmptyArr<Word>>,
  number: WordNumber
) {
  const matchWords = numberedMatches[number];
  const prefixes = matchPrefixes[number];
  const prefixedReplacements = numberedPrefixedReplacements[number];

  for (const match of matchWords) {
    const prefixed = addPrefixes(match, prefixes);
    const unprefixedVariantReplace = prefixedReplacements[0];
    for (let i = 0; i < prefixed.length; i++) {
      const variantMatch = prefixed[i];
      const variantReplace = prefixedReplacements[i];
      // skip this variant if either match or replace are undefined / empty OR both match & replace are the same.
      if (!variantMatch || !variantReplace || variantMatch === variantReplace)
        continue;
      appendVariant(
        variantMatch,
        match,
        variantReplace,
        unprefixedVariantReplace,
        number
      );
    }
  }
}

export function derivePrefixVariants(
  variants: NonEmptyArr<AliasVariant>,
  match: WordMatch,
  replacement: WordReplacement
) {
  const matchPrefixes = getMatchPrefixes(match);
  const replacementPrefixes = getMatchPrefixes(replacement);
  const numberedMatches: Record<WordNumber, NonEmptyArr<Word>> = {
    singular: toNonEmptyArray(match.singular),
    plural: toNonEmptyArray(match.plural),
  };
  const numberedPrefixedReplacements: Record<
    WordNumber,
    NonEmptyArr<Word>
  > = transformObject(replacementPrefixes, (prefixes, number) =>
    addPrefixes(replacement[number], prefixes)
  );

  function appendVariant(
    matchWord: Word,
    unprefixedMatchWord: Word,
    replaceWord: Word,
    unprefixedReplaceWord: Word,
    number: WordNumber
  ) {
    const matchData = formatWordMatchData(matchWord, match, number);
    const unprefixedMatchData = formatWordMatchData(
      unprefixedMatchWord,
      match,
      number
    );
    const replaceData = formatWordData(replaceWord, replacement.gender, number);
    const unprefixedReplaceData = formatWordData(
      unprefixedReplaceWord,
      replacement.gender,
      number
    );
    const variant: AliasVariant = {
      match: matchData,
      unprefixedMatch: unprefixedMatchData,
      replace: replaceData,
      unprefixedReplace: unprefixedReplaceData,
    };
    variants.push(...deriveCaseVariant(variant));
  }

  objectKeys(matchPrefixes).forEach((number) => {
    appendPrefixedVariants(
      appendVariant,
      numberedMatches,
      matchPrefixes,
      numberedPrefixedReplacements,
      number
    );
  });
}
