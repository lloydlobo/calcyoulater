import { STATE } from "../main";

/**
 * Checks the STATE global constant object cache for (count-1) value
 * if it exists and is a period it returns true
 * @param {number} count
 * @returns {boolean}
 */
export function prevStateValIsPeriod(count: number): boolean {
  return STATE.MAP_VALUES_HANDLE.get(count - 1) === ".";
}
