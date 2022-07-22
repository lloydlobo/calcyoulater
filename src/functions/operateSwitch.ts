/**
 * Primitive calculation without checking for edge cases
 * like 1/0
 *
 * @param {number} l
 * @param {number} m
 * @param {string} operatorType
 * @returns {any}
 */
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
