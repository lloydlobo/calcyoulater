/* eslint-disable import/prefer-default-export */
export function operatePrevCurr(a: number, b: number, op: string): number {
  let res = 0;
  if (a && b === 0 && op === "÷") return res; // a/b or 1/0 is reserved
  if (op === "÷") res = a / b;
  if (op === "*") res = a * b;
  if (op === "+") res = a + b;
  if (op === "-") res = a - b;
  // console.log({ a, op, b, res });
  return res * 1;
}
