import { outputDisplay, STATE } from "../main";
import { isOperator } from "../utils/isOperator";

export function updateDisplay(currNumOp: (string | number)[] | undefined) {
  if (!currNumOp) throw new Error("Cannot find mainHubNumOp result");
  if (STATE.isComputed && !isOperator(currNumOp[1])) {
    return;
  } // if user types a number after result display nothing
  if (isOperator(currNumOp[1])) {
    STATE.isComputed = false;
  }

  outputDisplay.innerText =
    outputDisplay.innerText.toString().trimEnd() + currNumOp[1].toString();

  const captureDisplayData = outputDisplay.innerText;

  STATE.capturedDisplayData = captureDisplayData;
}
