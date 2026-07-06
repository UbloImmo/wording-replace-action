import type { ItemOrArr, ItemOrNonEmptyArr } from "./global.types";
import type { Word, WordData, WordGender } from "./word.types";

export type AliasMatcher = string;

export type WordMatchIgore = {
  singular: ItemOrNonEmptyArr<Word>;
  // TODO: make it optional (default add s at the end)
  plural: ItemOrNonEmptyArr<Word>;
};

export type WordMatch = {
  singular: ItemOrNonEmptyArr<Word>;
  // TODO: make it optional (default add s at the end)
  plural: ItemOrNonEmptyArr<Word>;
  gender: WordGender;
  ignore?: ItemOrArr<WordMatchIgore>;
  ignoreAsAdjective?: boolean;
};

export type WordMatchData = WordData & {
  ignore: AliasMatcher[];
  ignoreAsAdjective: boolean;
};
