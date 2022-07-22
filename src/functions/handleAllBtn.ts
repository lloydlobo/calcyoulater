import { prevValIsAlsoOperator } from "../utils/prevValIsAlsoOperator";
import { prevValIsAlsoPeriod } from "../utils/prevValIsAlsoPeriod";
import { STATE } from "../main";

export function handleAllBtn(
  btn: HTMLButtonElement,
  clickCountBtn: number
): Map<any, any> | undefined {
  const val = btn.value;
  const count = clickCountBtn;
  if (prevValIsAlsoOperator(val, count)) return undefined;
  if (prevValIsAlsoPeriod(val, count)) return undefined;
  const currVal = STATE.MAP_VALUES_HANDLE.set(count, val);

  return currVal;
}
