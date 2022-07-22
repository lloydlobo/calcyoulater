/**
 * If the item is a number, return true, otherwise return false.
 * @param {any} item - any
 * @returns {boolean} A boolean
 */
export function isParsedItemANumber(item: any): boolean {
  return typeof parseFloat(item) === "number";
}
