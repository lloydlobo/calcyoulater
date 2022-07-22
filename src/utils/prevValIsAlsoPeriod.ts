import { currValIsAPeriod } from "./currValIsAPeriod";
import { prevStateValIsPeriod } from "./prevStateValIsPeriod";

/**
 * Checks if the previous input isn't also a decimal
 *
 * Returns false if the previous input is a decimal
 * This cut's off the value being cached for compute()
 * @param {string} val
 * @param {number} count
 * @returns {boolean}
 */
export function prevValIsAlsoPeriod(val: string, count: number): boolean {
  return (count > 0 &&
    prevStateValIsPeriod(count) &&
    currValIsAPeriod(val)) as boolean;
}
