import { isOperator } from "./isOperator";
import { isParsedItemANumber } from "./isParsedItemANumber";

export function isANumberOnly(item: any): boolean {
  return isParsedItemANumber(item) && !isOperator(item) && item !== "";
}
