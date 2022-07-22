import { handleHubMapFilterState } from "./functions/handleHubMapFilterState";

// ////////////////LOGIC///////////////

export function handleMapStateIfNumOrOperator(getValidNumAndOp: Map<any, any>) {
  let result;
  let isTrueIfOpFalseIfNum;
  // #1 Get DATA
  const res: (string | number)[] = handleHubMapFilterState(getValidNumAndOp);
  if (!res) throw new Error();
  if (parseFloat(res[1] as string).toString() !== "NaN") {
    isTrueIfOpFalseIfNum = false;
    result = [res[0] as number, res[1] as number];
  } else {
    isTrueIfOpFalseIfNum = true;
    result = [res[0] as number, res[1] as string];
  }
  if (typeof result[0] !== "number") throw new Error();
  // #3 Return params
  return [result[0], result[1], isTrueIfOpFalseIfNum];
}
