import { operatePrevCurr } from "../functions/operatePrevCurr";
import { STATE } from "../main";

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
    // if (!strOperator) throw new Error();
    // #6 Compute Result with each iteration
    if (i <= 1) {
      res = operatePrevCurr(floatPrev, floatCurr, strOperator);
    } else {
      res = operatePrevCurr(STATE.resultCache, floatCurr, strOperator);
    }
    // #7 Cache the result to Global DATA.result cache
    // if (!res) throw new Error();
    STATE.resultCache = res;
  } // end of for loop

  return res;
}
