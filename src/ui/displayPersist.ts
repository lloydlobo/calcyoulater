import { outputDisplay } from "../main";
import { operatorIsClicked } from "../utils/operatorIsClicked";

export function displayPersist(val: string | number) {
  // console.log({ val });
  if (operatorIsClicked(val as string)) {
    if (typeof val === "string") {
      outputDisplay.textContent = outputDisplay.textContent!.concat(val);
    }
  } else {
    if (
      outputDisplay.textContent === "0" &&
      outputDisplay.textContent.length === 1
    ) {
      outputDisplay.textContent = "";
    }
    outputDisplay.textContent = outputDisplay.textContent!.concat(
      val.toLocaleString()
    );
  }
}
