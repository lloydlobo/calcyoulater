/**
 * Calculates result based on 2 input numbers & an operator
 * @param {number} a
 * @param {number} b
 * @param {string} op
 * @returns {number}
 */
export function operatePrevCurr(a: number, b: number, op: string): number {
  let res = 0;

  if (a && b === 0 && op === "÷") return res; // a/b or 1/0 is reserved

  if (op === "÷") res = a / b;
  if (op === "*") res = a * b;
  if (op === "+") res = a + b;
  if (op === "-") res = a - b;

  return res;
}
