/**
 * Array that must at lease contain one item
 */
export type NonEmptyArr<T> = [T, ...T[]];

/**
 * Either a non-empty array or an item
 */
export type ItemOrNonEmptyArr<T> = T | NonEmptyArr<T>;

/**
 * Either an item or an array that may be empty
 */
export type ItemOrArr<T> = T | T[];

/**
 * String that must at least include one character
 */
export type NonEmptyStr = Exclude<string, { length: 0 } | "">;
