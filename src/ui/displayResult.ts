import { outputDisplay, STATE } from "../main";

export function displayResult() {
  outputDisplay.innerText = STATE.resultCache.toFixed(2).toString();
}
