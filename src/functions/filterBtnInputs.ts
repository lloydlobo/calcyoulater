import { isOperator } from "../utils/isOperator";
import { STATE } from "../main";

// When an operator is clicked
export function filterBtnInputs(
  fetchDataMap: Map<any, any>
): (string | number)[] | undefined {
  let currOp;
  let currNum;
  let result;

  const currData: string = fetchDataMap.get(STATE.countBtnClick);

  if (typeof parseFloat(currData) === "number") {
    const currCount = STATE.countFilterNumbers;
    currNum = currData;
    result = [currCount, currNum];
  }

  if (isOperator(currData)) {
    const currCount = STATE.countFilterOperators;
    currOp = currData;
    result = [currCount, currOp];
  }

  if (!result) {
    return undefined;
  }

  return result;
}
