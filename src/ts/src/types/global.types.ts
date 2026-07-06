export type NonEmptyArr<T> = [T, ...T[]];

export type ItemOrNonEmptyArr<T> = T | NonEmptyArr<T>;

export type ItemOrArr<T> = T | T[];

export type NonEmptyStr = Exclude<string, { length: 0 } | "">;
