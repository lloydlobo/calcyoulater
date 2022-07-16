// eslint-disable-next-line import/no-unresolved, import/extensions
import { isOperator } from "./isOperator";

// eslint-disable-next-line import/prefer-default-export
export function isANumberOnly(item: any): boolean {
  return (
    typeof parseFloat(item) === "number" && !isOperator(item) && item !== ""
  );
}
