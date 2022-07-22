import { STATE, outputDisplay } from "../main";

/**
 * If the count of button clicks is equal to 1,
 * then the output display is set to an empty string
 * before being updated with the first number.
 */
export function resetDisplayZeroToFirstNumberInput() {
  if (STATE.countBtnClick === 1) {
    outputDisplay.innerText = "";
  }
}
