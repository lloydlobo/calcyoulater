import { isOperator } from "./isOperator";
import { STATE } from "../main";

/**
 * Checks if the previous input isn't also a operator
 *
 * Returns false if the previous input is a operator
 * This cut's off the value being cached for compute()
 * @param {string} value
 * @param {number} count
 * @returns {boolean}
 */
export function prevValIsAlsoOperator(value: string, count: number): boolean {
  return (count > 0 &&
    isOperator(value) &&
    isOperator(STATE.MAP_VALUES_HANDLE.get(count - 1))) as boolean;
}
