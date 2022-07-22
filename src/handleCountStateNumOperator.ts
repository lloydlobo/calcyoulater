import { isOperator } from "./utils/isOperator";
// import { STATE } from "./main";

export function handleCountStateNumOperator(
  getFilteredNumOpArr: (string | number)[]
) {
  let trueIfOpFalseIfNum = true;
  if (isOperator(getFilteredNumOpArr[1])) {
    // STATE.countFilterOperators += 1;
    trueIfOpFalseIfNum = true;
  } else {
    // STATE.countFilterNumbers += 1;
    trueIfOpFalseIfNum = false;
  }

  return trueIfOpFalseIfNum;
}
