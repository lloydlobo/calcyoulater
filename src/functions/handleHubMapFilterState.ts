import { isOperator } from "../utils/isOperator";
import { STATE } from "../main";

export function handleHubMapFilterState(getValidNumAndOp: Map<any, any>): void {
  const currData: string = getValidNumAndOp.get(STATE.countBtnClick);
  if (typeof parseFloat(currData) === "number") {
    const currCount = STATE.countFilterNumbers;
    STATE.MAP_FILTER_NUM.set(currCount, currData);
  }
  if (isOperator(currData)) {
    const currCount = STATE.countFilterOperators;
    STATE.MAP_FILTER_OP.set(currCount, currCount);
  }
}
