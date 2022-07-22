import { isOperator } from "../utils/isOperator";

/**
 * `isNumAndOperator` checks if the value of the button is a number or an operator
 * @param {HTMLButtonElement} btn - HTMLButtonElement - this is the button that was clicked
 * @returns {boolean} A boolean
 */
export function isNumAndOperator(btn: HTMLButtonElement): boolean {
  const curr = btn.value;
  const regex = /[0-9]/gm;
  const currValMatchesRegex = curr.match(regex)?.join("");

  const isCurrValOperator: boolean = isOperator(curr);
  let isCurrValNumber;

  if (currValMatchesRegex) {
    isCurrValNumber = (typeof parseFloat(currValMatchesRegex) ===
      "number") as boolean;
  }

  if (isCurrValNumber as boolean) {
    return true;
  }

  if (isCurrValOperator) {
    return true;
  }

  return false;
}
