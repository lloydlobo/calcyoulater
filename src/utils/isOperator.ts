/**
 * Checks if the current item being passed is a valid operator
 * @param {string | number} item
 * @returns {boolean}
 */
export function isOperator(item: string | number): boolean {
  return item === "+" || item === "-" || item === "*" || item === "÷";
}
