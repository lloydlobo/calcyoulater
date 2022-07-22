import { isOperator } from "../utils/isOperator";
import { STATE } from "../main";

export function handleHubMapFilterState(
  getValidNumAndOp: Map<any, any>
): (string | number)[] {
  const currData: string = getValidNumAndOp.get(STATE.countBtnClick);
  let countNumber;
  let countOperator;
  let isNumber;
  let isOpera;
  let dataNum;
  let dataOp;
  let result;
  if (typeof parseFloat(currData) === "number") {
    const currCount = STATE.countFilterNumbers;
    countNumber = currCount;
    isNumber = true;
    dataNum = [countNumber, currData];
    // STATE.MAP_FILTER_NUM.set(currCount, currData);
  }

  if (isOperator(currData)) {
    const currCount = STATE.countFilterOperators;
    countOperator = currCount;
    isOpera = true;
    dataOp = [countOperator, currData];
    // STATE.MAP_FILTER_OP.set(currCount, currData);
  }
  if (isNumber) {
    if (!dataNum) throw new Error();
    result = dataNum;
  } else if (isOpera) {
    if (!dataOp) throw new Error();
    result = dataOp;
  }

  if (!result) throw new Error();
  return result;
}
