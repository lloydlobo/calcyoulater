import { outputDisplay, STATE } from "../main";

export function updateDisplay(currNumOp: (string | number)[] | undefined) {
  if (!currNumOp) throw new Error("Cannot find mainHubNumOp result");

  outputDisplay.innerText =
    outputDisplay.innerText.toString().trimEnd() + currNumOp[1].toString();

  const captureDisplayData = outputDisplay.innerText;

  STATE.capturedDisplayData = captureDisplayData;
}
