/**
 * Returns true if any of the operator passed into val matches the operator
 * @param {string} val
 * @returns {boolean}
 */
export function operatorIsClicked(val: string): boolean {
  return val === "-" || val === "+" || val === "*" || val === "÷";
}
