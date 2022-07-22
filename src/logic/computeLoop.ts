import { operatePrevCurr } from "../functions/operatePrevCurr";
import { STATE } from "../main";

function handleError(
  strOperator: string,
  floatPrev: number,
  floatCurr: number
) {
  // This also blocks any processing when = is pressed
  if (!strOperator) throw new Error();
  if (!floatPrev || !floatCurr) throw new Error();
}

export function computeLoop(
  arrNumbers: string[],
  arrOperators: string[],
  floatPrev: number,
  result: any
) {
  let res = result;
  let strCurr;
  let floatCurr;
  let strOperator;

  for (let i = 1; i < arrNumbers.length; i += 1) {
    strCurr = arrNumbers[i];
    strOperator = arrOperators[i - 1];
    floatCurr = parseFloat(strCurr);
    handleError(strOperator, floatPrev, floatCurr);

    // #6 Compute Result with each iteration
    if (i <= 1) {
      res = operatePrevCurr(floatPrev, floatCurr, strOperator);
    } else {
      res = operatePrevCurr(STATE.resultCache, floatCurr, strOperator);
    }
    // #7 Cache the result to Global DATA.result cache
    if (!res) throw new Error();
    STATE.resultCache = res;
  } // end of for loop

  return res;
}
