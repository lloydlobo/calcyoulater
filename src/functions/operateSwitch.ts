/* eslint-disable import/prefer-default-export */
export function operateSwitch(
  l: number,
  m: number,
  operatorType: string
): number | null {
  let result = null;
  if (operatorType === "÷") result = l / m;
  if (operatorType === "*") result = l * m;
  if (operatorType === "+") result = l + m;
  if (operatorType === "-") result = l - m;
  return result;
}
