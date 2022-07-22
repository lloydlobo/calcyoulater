import { STATE, inputHistory } from "../main";

export function displayHistory() {
  inputHistory.innerText = STATE.capturedDisplayData.trim();
}
