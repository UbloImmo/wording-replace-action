import type { NonEmptyArr } from "../types/global.types";
import type { Prefix } from "../types/prefix.types";
import type { WordGender, WordNumber } from "../types/word.types";

export const SHORT_PREFIX_MATCHERS = new Set([
  "a",
  "à",
  "e",
  "é",
  "è",
  "ê",
  "i",
  "ï",
  "o",
  "u",
  "y",
  "h",
]);

export const SINGULAR_M_PREFIXES: NonEmptyArr<Prefix> = [
  { prefix: "le ", shortPrefix: "l'" },
  { prefix: "du ", shortPrefix: "de l'" },
  { prefix: "de ", shortPrefix: "d'" },
  { prefix: "au", shortPrefix: "à l'" },
  { prefix: "un " },
  { prefix: "mon " },
  { prefix: "son " },
  { prefix: "ton " },
  { prefix: "notre " },
  { prefix: "votre " },
  { prefix: "aucun " },
  { prefix: "ce ", shortPrefix: "cet " },
  { prefix: "quel " },
] as const;

export const SINGULAR_F_PREFIXES: NonEmptyArr<Prefix> = [
  { prefix: "la ", shortPrefix: "l'" },
  { prefix: "de la ", shortPrefix: "de l'" },
  { prefix: "de ", shortPrefix: "d'" },
  { prefix: "au", shortPrefix: "à l'" },
  { prefix: "une " },
  { prefix: "ma " },
  { prefix: "sa " },
  { prefix: "ta " },
  { prefix: "notre " },
  { prefix: "votre " },
  { prefix: "aucune " },
  { prefix: "cette " },
  { prefix: "quelle " },
] as const;

export const PLURAL_M_PREFIXES: NonEmptyArr<Prefix> = [
  { prefix: "les " },
  { prefix: "des " },
  { prefix: "aux" },
  // { prefix: "plusieurs " },
  { prefix: "ces " },
  { prefix: "tes " },
  { prefix: "leurs " },
  { prefix: "quels " },
  { prefix: "ses " },
  { prefix: "mes " },
  { prefix: "nos " },
  { prefix: "vos " },
] as const;

export const PLURAL_F_PREFIXES: NonEmptyArr<Prefix> = [
  { prefix: "les " },
  { prefix: "des " },
  { prefix: "aux" },
  // { prefix: "plusieurs " },
  { prefix: "ces " },
  { prefix: "tes " },
  { prefix: "leurs " },
  { prefix: "quelles " },
  { prefix: "ses " },
  { prefix: "mes " },
  { prefix: "nos " },
  { prefix: "vos " },
] as const;

export const PREFIXES: Readonly<
  Record<WordGender, Record<WordNumber, NonEmptyArr<Prefix>>>
> = Object.freeze({
  f: {
    plural: PLURAL_F_PREFIXES,
    singular: SINGULAR_F_PREFIXES,
  },
  m: {
    plural: PLURAL_M_PREFIXES,
    singular: SINGULAR_M_PREFIXES,
  },
});
