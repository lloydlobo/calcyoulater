import { handleHubMapFilterState } from "./functions/handleHubMapFilterState";
// import { STATE } from "./main";

// type DataAndNumberType = {
//   currData: string;
//   countNumber: number;
//   countOperator?: undefined;
// };
// type DataAndOperatorType = {
//   currData: string;
//   countOperator: number | undefined;
//   countNumber?: undefined;
// };
// ////////////////LOGIC///////////////

export function handleMapStateIfNumOrOperator(getValidNumAndOp: Map<any, any>) {
  let result;
  let isTrueIfOpFalseIfNum = true;
  // #1 Get DATA
  const res: (string | number)[] = handleHubMapFilterState(getValidNumAndOp);
  if (!res) throw new Error();

  if (typeof Number(res[1]) === "number") {
    isTrueIfOpFalseIfNum = false;
    result = [res[0] as number, res[1] as number] as number[];
  } else {
    isTrueIfOpFalseIfNum = true;
    result = [Number(res[1]) as number, res[1] as string] as (
      | string
      | number
    )[];
  }
  if (typeof result[0] !== "number") throw new Error();
  // #3 Return params
  return [result[0], result[1], isTrueIfOpFalseIfNum];
}
