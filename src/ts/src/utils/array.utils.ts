import { isArray, isUndefined, type Optional } from "@ubloimmo/front-util";
import type {
  ItemOrArr,
  ItemOrNonEmptyArr,
  NonEmptyArr,
} from "../types/global.types";

export function toNonEmptyArray<T>(
  itemOrArr: ItemOrNonEmptyArr<T>
): NonEmptyArr<T> {
  if (isArray(itemOrArr)) return itemOrArr;
  return [itemOrArr];
}

export function toArray<T>(itemOrArr: Optional<ItemOrArr<T>>): T[] {
  if (isArray(itemOrArr)) return itemOrArr;
  if (isUndefined(itemOrArr)) return [];
  return [itemOrArr];
}
