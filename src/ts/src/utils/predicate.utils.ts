import { isArray, isObject, isString } from "@ubloimmo/front-util";
import type { WordMatch } from "../types/match.types";
import type { WordReplacement } from "../types/replacement.types";
import type { Alias, AliasCollection } from "../types/alias.types";
import type { ItemOrNonEmptyArr, NonEmptyArr } from "../types/global.types";
import type { WordGender } from "../types/word.types";

export function isNonEmptyStr(value: unknown): value is string {
  return isString(value) && value.length > 0;
}

export function isWordGender(value: unknown): value is WordGender {
  return value === "f" || value === "m";
}

export function isWordMatch(value: unknown): value is WordMatch {
  if (!isObject(value)) return false;
  if (!("singular" in value)) return false;
  if (!("plural" in value)) return false;
  if (!("gender" in value)) return false;

  return (
    isWordGender(value.gender) &&
    isItemOrNonEmptyArr(value.singular, isNonEmptyStr) &&
    isItemOrNonEmptyArr(value.plural, isNonEmptyStr)
  );
}

export function isWordReplacement(value: unknown): value is WordReplacement {
  if (!isObject(value)) return false;
  if (!("singular" in value)) return false;
  if (!("plural" in value)) return false;
  if (!("gender" in value)) return false;

  return (
    isWordGender(value.gender) &&
    isNonEmptyStr(value.singular) &&
    isNonEmptyStr(value.plural)
  );
}

export function isNonEmptyArr<T>(
  value: unknown,
  itemPredicate: (v: unknown) => v is T
): value is NonEmptyArr<T> {
  return isArray(value) && value.length >= 0 && value.every(itemPredicate);
}

export function isItemOrNonEmptyArr<T>(
  value: unknown,
  itemPredicate: (v: unknown) => v is T
): value is ItemOrNonEmptyArr<T> {
  return itemPredicate(value) || isNonEmptyArr(value, itemPredicate);
}

export function isAlias(value: unknown): value is Alias {
  if (!isObject(value)) return false;
  if (!("match" in value)) return false;
  if (!("replace" in value)) return false;

  return (
    isItemOrNonEmptyArr(value.match, isWordMatch) &&
    isWordReplacement(value.replace)
  );
}

export function isAliasCollection(value: unknown): value is AliasCollection {
  if (!isArray(value)) return false;
  return value.every(isAlias);
}
