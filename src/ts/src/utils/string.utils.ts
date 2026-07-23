import { capitalize } from "@ubloimmo/front-util";

export function clone(str: string) {
  return `${str}`;
}

export function toTrimmed(str: string) {
  return clone(str).trim();
}

export function toUpperCase(str: string) {
  return clone(str).toUpperCase();
}

export function isUppercase(str: string) {
  return str === toUpperCase(str);
}

export function toLowerCase(str: string) {
  return clone(str).toLowerCase();
}

export function isLowercase(str: string) {
  return str === toLowerCase(str);
}

export function toCapitalized(str: string) {
  return capitalize(clone(str));
}

export function isCapitalized(str: string) {
  return str === toCapitalized(str);
}

export function matchCase(matchStr: string, replacementStr: string) {
  if (isUppercase(matchStr)) return toUpperCase(replacementStr);
  if (isLowercase(matchStr)) return toLowerCase(replacementStr);
  if (isCapitalized(matchStr)) return toCapitalized(replacementStr);
  return replacementStr;
}

export function splice(
  str: string,
  start: number,
  end: number,
  replaceWith: string
) {
  const before = start <= 0 ? "" : str.substring(0, start);
  const after = end >= str.length ? "" : str.substring(end);

  return `${before}${replaceWith}${after}`;
}

export function normalize(str: string) {
  return toLowerCase(toTrimmed(str));
}
