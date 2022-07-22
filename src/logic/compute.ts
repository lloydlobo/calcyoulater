import { STATE } from "../main";
import { flattenDataMapCache } from "../functions/flattenDataMapCache";
import { computeLoop } from "./computeLoop";
import { filterRegex } from "./filterRegex";

export function compute() {
  // #1 Flatten Map to Array
  const mappedData = STATE.MAP_DATA;
  const { arrData } = flattenDataMapCache(mappedData);
  // #2 Convert Array to a string
  const arrDataCopy = arrData; // (7) ['2', '2', '3', '3', '+', '6', '6']
  const strJoinArrData = arrDataCopy.join("").trim();
  const { arrNumbers, arrOperator } = filterRegex(strJoinArrData);

  // #4 Allocate num & operator from arrays to prev & curr & operator
  let strPrev;
  if (STATE.countCompute > 1) strPrev = STATE.resultCache.toString();
  else if (STATE.countCompute === 1) strPrev = arrNumbers[0].toString();
  if (!strPrev) throw new Error();
  const floatPrev = parseFloat(strPrev);
  let result = floatPrev;
  // #5 Iterate and get result from array
  result = computeLoop(arrNumbers, arrOperator, floatPrev, result); // end of for loop
  STATE.MAP_DATA.clear();
  STATE.countBtnClick = 1;
  STATE.MAP_DATA.set(1, result);
  if (!result) throw new Error();

  return result;
}
