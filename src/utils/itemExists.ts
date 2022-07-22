/**
 * Checks if the parsed regex replace method
 * doesn't return empty string or a period
 * @param {string} item
 * @returns {boolean}
 */
export function itemExists(item: string): boolean {
  return item !== " " && item !== "" && item !== ".";
}
