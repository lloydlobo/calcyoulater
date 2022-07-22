import { prevValIsAlsoOperator } from "../utils/prevValIsAlsoOperator";
import { prevValIsAlsoPeriod } from "../utils/prevValIsAlsoPeriod";
import { REGEX, STATE } from "../main";

export function queryKeyboardRegex(val: string) {
  let result;
  const value = val;
  if (value.match(REGEX.regexIsNumber) || value.match(REGEX.regexIsOperator)) {
    result = value;
  }

  return result;
}

// export function handleKeyboardRegex(val) { }

export function handleAllBtn(
  ev: HTMLButtonElement | KeyboardEvent,
  clickCountBtn: number
): Map<any, any> | undefined {
  let getVal;
  let val;
  if (ev.type === "submit") {
    getVal = (ev as HTMLButtonElement).value;
    val = getVal;
  } else {
    getVal = (ev as KeyboardEvent).key;
    val = queryKeyboardRegex(getVal);
  }
  // const filterVal = handleKeyboardRegex(isValidVal);

  if (typeof val === "undefined") {
    throw new Error("Invalid value provided");
  }
  const count = clickCountBtn;

  if (prevValIsAlsoOperator(val, count)) return undefined;
  if (prevValIsAlsoPeriod(val, count)) return undefined;

  const currVal = STATE.MAP_VALUES_HANDLE.set(count, val);

  return currVal;
}
