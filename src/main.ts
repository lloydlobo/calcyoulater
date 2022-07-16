/* eslint-disable import/no-mutable-exports */
/* eslint-disable import/no-unresolved */ /* eslint-disable import/extensions */ /* eslint-disable no-console */

import "./style.css";
import { displayPersist } from "./ui/displayPersist";
import { drawData } from "./charts/drawData";
import { drawLineOnCanvas, fillBlankOnCanvas } from "./canvas/canvas";
import { equalsIsClicked } from "./utils/equalsIsClicked";
import { isANumberOnly } from "./utils/isANumberOnly";
import { isOperator } from "./utils/isOperator";
import { operatePrevCurr } from "./functions/operatePrevCurr";
import { operateSwitch } from "./functions/operateSwitch";

// /////////////////////////APP///////
const app = document.querySelector<HTMLDivElement>("#app")!;
const appClass = app.className;
appClass.toLowerCase();

// ///////////////////////CHARTS D3///
const d3Article = document.getElementById("d3");
export const d3Label = document.getElementById("d3Label") as HTMLLabelElement;
export const btnD3Category = document.getElementById( "btnD3Category") as HTMLButtonElement; // prettier-ignore

if (!d3Article) throw new Error("d3 not found");
export const d3Array: any[] = [];
// D3 DATA RENDERING !!!!
drawData();

// ////////////////CONSTANTS/////////
export const outputDisplay = document.querySelector( "#output") as HTMLOutputElement; // prettier-ignore
export const inputHistory = document.querySelector("#inputHistory") as any;
export const btnDecimal = document.getElementById("btnDecimal") as HTMLButtonElement; // prettier-ignore

const btnAll = document.getElementsByTagName("button") as any;
const btnClear = document.getElementById("btnClear") as HTMLButtonElement;
const btnAllClear = document.getElementById("btnAllClear") as HTMLButtonElement;
const btnClearArray = [btnClear, btnAllClear];
const btnGetHistory = document.getElementById("btnHistory") as HTMLButtonElement; // prettier-ignore
const btnCalculate = document.getElementById("btnResultEquals") as HTMLButtonElement; // prettier-ignore

export let inputOutputArray: string[] = [];
let cacheDigitsArray: (string | number)[] = [];
let cacheOperatorsArray: string[] = [];

const allBtn: HTMLButtonElement[] = [];
// Spread btnAll to access forEach method
const allButtons = [...btnAll];
allButtons.forEach((btn) => {
  allBtn.push(btn);
});

// ////////////////CANVAS////////////
const outputVal = outputDisplay.textContent;
if (!outputVal) throw new Error("outputVal is not defined");

export const output = parseInt(outputVal, 10); // animate canvas with a variable
export const operatorIsClicked = (val: string) =>
  val === "-" || val === "+" || val === "*" || val === "÷";

// Animate the canvas at intervals
const animateCanvas = (
  drawTime: number | undefined,
  blankTime: number | undefined
) => {
  setInterval(drawLineOnCanvas, drawTime);
  setInterval(fillBlankOnCanvas, blankTime);
};

// ////////////////DRAW CANVAS//////////
const drawCanvas = () => animateCanvas(1000, 1000);
drawCanvas();

// ////////////////DOM DISPLAY INPUT/////

export let valString = "";
export let x: number | null = null;
export let y: number | null = null;
export let operator: string | null = null;
export let inputArray: string[] = [];
export let resultInputArray: string[] = [];
export let historyBtnIsToggled = false;
export let savedCurrentOperateHistory = "";
export let countResultsForHistory = 0;

let inputCount = 0;
let operatorCount = 0;
let isReset: boolean;
let data = 0;
let nextNumber: number | null = null;

// ////////////////LOGIC///////////////

const MAP_NUM = new Map();
const MAP_NUMBERS = new Map();
const MAP_OPERATORS = new Map();

let MAP_VALUE = new Map();
let prev: number;
let curr: number;
let next: number;
let decimalBtnIsToggled = true;
let currOp: string;

export function resetValues(
  a: number | null,
  b: number | null,
  z: string | null
) {
  x = a;
  y = b;
  operator = z;
  x = null;
  y = null;
  operator = null;
  return true;
}
function clickDecimalOnce() {
  if (decimalBtnIsToggled) btnDecimal.disabled = true;
  else btnDecimal.disabled = false;
  decimalBtnIsToggled = !decimalBtnIsToggled;
}
function handleXYReset() {
  if (isReset) {
    x = null;
    y = null;
    isReset = false;
  }
}

function setValString(val: string) {
  if (!equalsIsClicked(val)) {
    valString = valString.concat(val);
    MAP_VALUE.set(operatorCount, valString);
  }
}
function setOperatorValue(val: string) {
  if (operatorIsClicked(val)) {
    operatorCount += 1; // switch off x_concat as it now takes result
    operator = val;
    displayPersist(operator);
    cacheOperatorsArray.push(operator);
    cacheDigitsArray.push(operator);
  }
}

const xIsEntered = (val: string) => {
  if (!x) throw new Error("x is not defined");
  return (
    x.toString().length >= 1 && !operatorIsClicked(val) && operatorCount === 0
  );
};
function handleXValue(val: string) {
  if (inputCount > 0) x = parseFloat(valString.trim());
  if (!x || x.toString().length < 1) {
    x = parseFloat(val.trim());
    displayPersist(val);
    cacheDigitsArray.push(x);
  } else if (xIsEntered(val)) {
    x = parseFloat(x.toString().concat(val));
    displayPersist(val);
    cacheDigitsArray.push(x);
  }
}
function handleYValue(val: string) {
  if (operatorCount > 0 && !operatorIsClicked(val)) {
    if (!y || y.toString().length < 1) {
      y = parseFloat(val);
      displayPersist(val);
      cacheDigitsArray.push(y);
      nextNumber = y;
      MAP_NUM.set(operatorCount, y);
    } else if (y.toString().length >= 1) {
      if (!nextNumber) throw new Error("nextNumber must be defined");
      y = parseFloat(nextNumber.toString().concat(val));
      displayPersist(val);
      MAP_NUM.set(operatorCount, y);
      cacheDigitsArray.push(y);
    }
  }
}

if (data === undefined) throw new Error("Invalid data");

function handleCalculationsMapping() {
  for (let i = 1; i <= MAP_NUMBERS.size * 2 - 3; i += 2) {
    const nextIndexIsEven = (i + 1) % 2 === 0;
    const currIndexIsEven = i % 2 === 0;
    if (nextIndexIsEven) currOp = MAP_OPERATORS.get(i + 1) as string;
    if (!currIndexIsEven && i <= MAP_NUMBERS.size * 2 - 1) {
      if (i === 1) {
        prev = parseFloat(MAP_NUMBERS.get(i));
        curr = parseFloat(MAP_NUMBERS.get(i + 2));
        next = operatePrevCurr(prev, curr, currOp as string) as number;
      }
      if (i > 1) {
        if (!next || next.toString().length < 1)
          throw new Error("Next: Invalid number");
        prev = next;
        curr = parseFloat(MAP_NUMBERS.get(i + 2));
        next = operatePrevCurr(prev, curr, currOp as string) as number;
      }
    } // end of if (currIndexIsEven)
  } // end of for loop
}

function operateMap() {
  const dataMap = MAP_VALUE;
  const lastData = dataMap.get(operatorCount);
  const regExpNumAndOperator = /(\d*\.\d+|\d+\.\d*|\d+)/gm;
  if (!lastData) throw new Error("lastData is not defined");
  const dataArr = lastData.split(regExpNumAndOperator);
  for (let i = 1; i < dataArr.length - 1; i += 1) {
    const item = dataArr[i];
    if (isANumberOnly(item)) MAP_NUMBERS.set(i, item);
    if (isOperator(item)) MAP_OPERATORS.set(i, item);
  } // end of for loop
  handleCalculationsMapping();
  outputDisplay.textContent = "";
  if (!next) throw new Error("next number not found ");

  return next as number;
}

function operate() {
  const resMap = operateMap();
  valString = "";
  MAP_VALUE = new Map();
  outputDisplay.textContent = resMap.toFixed(2).toString();
  inputArray.push(valString);
  if (!x || !y || !operator) throw new Error("Invalid data");
  let result = operateSwitch(x, y, operator);
  if (!result) result = 0;
}

// ////////////////END///////////////
export function disableHideHistoryButton() {
  if (inputArray.length === 0) {
    console.log("disabled");
    btnGetHistory.disabled = true;
    btnGetHistory.style.opacity = "0";
  }
}
function handleClearAll(btn: HTMLButtonElement) {
  if (btn.value === "AC") {
    inputArray = [];
    resultInputArray = [];
    countResultsForHistory = 0;
    savedCurrentOperateHistory = "";
    inputOutputArray = [];
    cacheOperatorsArray = [];
    cacheDigitsArray = [];
    disableHideHistoryButton();
    console.clear();
  }
}
function handleClear() {
  outputDisplay.textContent = "0";
  inputHistory.textContent = "Ans = 0";
  inputCount = 0;
  operatorCount = 0;
  valString = "";
  data = 0;
}

// HISTORY
function handleHistoryBtnToggle() {
  // eslint-disable-next-line no-import-assign
  if (!historyBtnIsToggled) historyBtnIsToggled = true;
  else historyBtnIsToggled = false;
}
function hasCachedAnOperation() {
  return (
    inputArray.length > 0 && countResultsForHistory < resultInputArray.length
  );
}
function handleInputHistoryDisplay() {
  resultInputArray.join(" ");
  let inputOutput = "";
  for (let i = countResultsForHistory; i < resultInputArray.length; i += 1) {
    inputOutput = ` ${inputArray[i]} = ${resultInputArray[i]} `;
    inputOutputArray.push(inputOutput);
  }
  countResultsForHistory = resultInputArray.length;
}
function handleHistory() {
  handleHistoryBtnToggle();

  if (hasCachedAnOperation()) handleInputHistoryDisplay();
  if (historyBtnIsToggled) {
    inputHistory.textContent = inputOutputArray;
    historyBtnIsToggled = true;
  } else {
    inputHistory.textContent = savedCurrentOperateHistory;
    historyBtnIsToggled = false;
  }
}

// //// MAIN ////
allBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    // disableHideHistoryButton();
    const val = btn.value;
    handleXYReset();
    setValString(val);
    setOperatorValue(val);
    if (val === "=") return;
    data = parseFloat(val);
    handleXValue(val);
    MAP_NUM.set(inputCount, x);
    handleYValue(val);
  });
});

// Calculate result when "=" is entered/clicked
btnCalculate.addEventListener("click", operate);

btnClearArray.forEach((btn) => {
  btn.addEventListener("click", async () => {
    handleClearAll(btn);
    handleClear();
    resetValues(x, y, operator);
  });
});

btnGetHistory.addEventListener("click", handleHistory);
btnDecimal.removeEventListener("click", clickDecimalOnce, false);
btnDecimal.addEventListener("click", clickDecimalOnce);
