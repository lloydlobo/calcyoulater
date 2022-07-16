/* eslint-disable import/no-unresolved */ /* eslint-disable import/extensions */ /* eslint-disable no-console */

import "./style.css";
import { drawLineOnCanvas, fillBlankOnCanvas } from "./canvas/canvas";
import { drawData } from "./charts/drawData";
// import { operatorArith } from "./logic/calculator";

// /////////////////////////APP///////
const app = document.querySelector<HTMLDivElement>("#app")!;
const appClass = app.className;
appClass.toLowerCase();

// ///////////////////////CHARTS D3///
const d3Article = document.getElementById("d3");
export const d3Label = document.getElementById("d3Label") as HTMLLabelElement;
export const btnD3Category = document.getElementById(
  "btnD3Category"
) as HTMLButtonElement;
if (!d3Article) throw new Error("d3 not found");
export const d3Array: any[] = [];
// D3 DATA RENDERING !!!!
drawData();

// ////////////////CONSTANTS/////////
export const outputDisplay = document.querySelector( "#output") as HTMLOutputElement; // prettier-ignore
const btnAll = document.getElementsByTagName("button") as any;
const btnClear = document.getElementById("btnClear") as HTMLButtonElement;
const btnAllClear = document.getElementById("btnAllClear") as HTMLButtonElement;

const btnGetHistory = document.getElementById(
  "btnHistory"
) as HTMLButtonElement;

const btnClearArray = [btnClear, btnAllClear];
const btnDecimal = document.getElementById("btnDecimal") as HTMLButtonElement;

const btnCalculate = document.getElementById(
  "btnResultEquals"
) as HTMLButtonElement;

export const inputHistory = document.querySelector("#inputHistory") as any;
let cacheResultsArray: string[] = [];
let cacheDigitsArray: (string | number)[] = [];
let cacheOperatorsArray: string[] = [];

// MUTABLE VARIABLES
const allBtn: HTMLButtonElement[] = [];
// Spread btnAll to access forEach method
const allButtons = [...btnAll];
allButtons.forEach((btn) => {
  allBtn.push(btn);
});

// disableNumbers(); // disableOperators(); // disableEquals(); // disableAll(); // disableMemory(); // disableClear(); // disablePlusMinus();

// ////////////////CANVAS////////////
// GET TEXT From User Input in DOM Display
const outputVal = outputDisplay.textContent;
if (!outputVal) throw new Error("outputVal is not defined");
export const output = parseInt(outputVal, 10); // animate canvas with a variable

// Animate the canvas at intervals
const animateCanvas = (
  drawTime: number | undefined,
  blankTime: number | undefined
) => {
  setInterval(drawLineOnCanvas, drawTime);
  setInterval(fillBlankOnCanvas, blankTime);
};

// ////////////////DRAW CANVAS//////////
function drawCanvas() {
  animateCanvas(1000, 1000);
}
drawCanvas();

// ////////////////DOM DISPLAY INPUT/////
function operatorIsClicked(val: string) {
  return val === "-" || val === "+" || val === "*" || val === "÷";
}

function displayPersist(val: string | number) {
  console.log({ val });
  if (operatorIsClicked(val as string)) {
    if (typeof val === "string") {
      outputDisplay.textContent = outputDisplay.textContent!.concat(val);
    }
  } else {
    if (
      outputDisplay.textContent === "0" &&
      outputDisplay.textContent.length === 1
    ) {
      outputDisplay.textContent = "";
    }
    outputDisplay.textContent = outputDisplay.textContent!.concat(
      val.toLocaleString()
    );
  }
}

// ///////////////////////SETUP//////////

let inputCount = 0;
// let inputCountLast = 0;
let operatorCount = 0;

let valString = "";
// START OF GLOBAL VARIABLES
let x: number | null = null;
let y: number | null = null;
let nextNumber: number | null = null;
let operator: string | null = null;
let data = 0;
let inputArray: string[] = [];
let resultInputArray: string[] = [];
let isReset: boolean;
const valMap = new Map();
function equalsIsClicked(val: string) {
  if (val !== "=") return false;
  return true;
}

function resetValues(a: number | null, b: number | null, z: string | null) {
  x = a;
  y = b;
  operator = z;

  x = null;
  y = null;
  operator = null;

  // return [x, y, operator];
  return true;
}

let toggle = true;

function clickDecimalOnce() {
  if (toggle) {
    btnDecimal.disabled = true;
  } else {
    btnDecimal.disabled = false;
  }
  toggle = !toggle;
}
btnDecimal.removeEventListener("click", clickDecimalOnce, false);

// allow decimal to be pressed only once
btnDecimal.addEventListener("click", () => {
  clickDecimalOnce();
});

const numMap = new Map();

allBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    const val = btn.value;

    if (isReset) {
      x = null;
      y = null;
      isReset = false;
    }

    if (!equalsIsClicked(val)) {
      valString = valString.concat(val);
      valMap.set(operatorCount, valString);
      console.log({ valMap });
      console.log(valString);
    }
    console.log({ inputArray });
    if (operatorIsClicked(val)) {
      operatorCount += 1; // switch off x_concat as it now takes result
      console.log({ operatorCount });
      operator = val;
      displayPersist(operator);
      cacheOperatorsArray.push(operator);
      cacheDigitsArray.push(operator); // FIXME maybe make it a json object with titles
    }
    if (val === "=") return;
    data = parseFloat(val);

    if (inputCount > 0) {
      x = parseFloat(valString.trim());
    }

    if (!x || x.toString().length < 1) {
      x = parseFloat(val.trim());
      displayPersist(val);
      cacheDigitsArray.push(x);
    } else if (
      x.toString().length >= 1 &&
      !operatorIsClicked(val) &&
      operatorCount === 0
    ) {
      x = parseFloat(x.toString().concat(val));
      cacheDigitsArray.push(x);
      console.log({ x_concat: x });
      displayPersist(val);
    }
    numMap.set(inputCount, x);
    console.log({ numMap_x: numMap });
    // const currentOperatorCount = operatorCount + 1;
    if (operatorCount > 0 && !operatorIsClicked(val)) {
      if (!y || y.toString().length < 1) {
        y = parseFloat(val);
        cacheDigitsArray.push(y);
        nextNumber = y;
        numMap.set(operatorCount, y);
        displayPersist(val);
      } else if (y.toString().length >= 1) {
        if (!nextNumber) {
          throw new Error("Number must be defined");
        }
        // y = parseFloat(y.toString().concat(val));
        console.log({ nextNumber });
        y = parseFloat(nextNumber.toString().concat(val)); // FIXME splice val from nextNumber
        numMap.set(operatorCount, y);

        displayPersist(val);
        cacheDigitsArray.push(y);
      }
    }
    // numMap.set(inputCount, y);
    console.log({ numMap });
    console.log({ cacheDigitsArray });
    console.log({ x, y, operator });
  });
});

if (data === undefined) throw new Error("Invalid data");

/**
 * 1. Need 3 arrays to capture number, operator, and result
 * 2. the numbers one can be a json object too?
 *
 */

// ////////////////LOGIC///////////////
function operateSwitch(
  l: number,
  m: number,
  operatorType: string
): number | null {
  let result = null;
  if (operatorType === "÷") {
    result = l / m;
  }
  if (operatorType === "*") {
    result = l * m;
  }
  if (operatorType === "+") {
    result = l + m;
  }
  if (operatorType === "-") {
    result = l - m;
  }
  isReset = resetValues(x, y, operator);
  return result;
}

let savedCurrentOperateHistory = "";
let countResultsForHistory = 0;

function isOperator(item: any) {
  return item === "+" || item === "-" || item === "*" || item === "÷";
}
const numItemMap = new Map();
const operaItemMap = new Map();

function operatePrevCurr(a: number, b: number, op: string): number {
  let res = 0;
  if (a && b === 0 && op === "÷") return res; // a/b or 1/0 is reserved
  if (op === "÷") res = a / b;
  if (op === "*") res = a * b;
  if (op === "+") res = a + b;
  if (op === "-") res = a - b;
  return parseFloat(res.toExponential(2));
}
function operateMap() {
  const dataMap = valMap;
  const lastData = dataMap.get(operatorCount);
  // const regExpNumOnly = /[0-8]/gm;
  const regExpNumAndOperator = /[+-]?(\d*\.\d+|\d+\.\d*|\d+)/gm; // gm -> global & multiline
  const dataArr = lastData.split(regExpNumAndOperator);
  for (let i = 1; i < dataArr.length - 1; i += 1) {
    const item = dataArr[i];
    if (
      typeof parseFloat(item) === "number" &&
      !isOperator(item) &&
      item !== ""
    ) {
      const num = item;
      numItemMap.set(i, num);
      console.log("item", num);
    }
    if (isOperator(item)) {
      const opera = item;
      operaItemMap.set(i, opera);
      console.log("operator", opera);
    }
  }
  // TODO get the opera from operaMap
  /**
   * Map(5) {1 => '66', 3 => '99', 5 => '88', 7 => '2', 9 => '1'}
   * Map(4) {2 => '*', 4 => '÷', 6 => '*', 8 => '÷'}
   * */
  console.log(numItemMap, operaItemMap);
  let prev;
  let curr;
  let next;
  // let prevOp;
  let currOp;
  // let nextOp;
  for (let i = 1; i < numItemMap.size + 2; i += 2) {
    // prevOp = operaItemMap.get(i + 1);
    currOp = operaItemMap.get(i + 1);
    console.log({ currOp });
    // nextOp = operaItemMap.get(i + 5);
    if (i % 2 !== 0) {
      if (i === 1) {
        prev = parseFloat(numItemMap.get(i));
        curr = parseFloat(numItemMap.get(i + 2));
        next = operatePrevCurr(prev, curr, currOp);
      }
      if (i > 1) {
        if (!next) throw new Error("Next: Invalid number");
        prev = next;
        curr = parseFloat(numItemMap.get(i + 2));
        next = operatePrevCurr(prev, curr, currOp);
      }
    }
    console.log({ prev, currOp, curr, next });
  }
  console.log({ dataMap, lastData, dataArr });

  outputDisplay.textContent = "";
  if (!next) throw new Error("next number not found ");
  outputDisplay.textContent = next.toString();
  return next as number;
}

function operate() {
  operateMap();
  console.log({ inputArray });
  inputArray.push(valString);
  if (!x || !y || !operator) throw new Error("Invalid data");
  let result = operateSwitch(x, y, operator);
  if (!result) result = 0;

  valString = result.toString(); // reset valString - so first item is result
  resultInputArray.push(valString);
  console.log({ valString });
  if (!outputDisplay.textContent)
    throw new Error("Output display is undefined");
  cacheResultsArray.push(outputDisplay.textContent); // FIXME mixed ui & business logic
  const xCopy = x;
  const yCopy = y;
  const operatorCopy = operator;
  resetValues(x, y, operator);

  inputHistory.textContent = `${xCopy} ${operatorCopy} ${yCopy} = ${valString}`;

  savedCurrentOperateHistory = inputHistory.textContent;
  // outputDisplay.textContent = valString; //FIXME latest bug fix

  toggle = false;
  clickDecimalOnce();
  btnGetHistory.style.opacity = "1";
  console.log({ cacheOperatorsArray });
  inputCount += 1; // prepare all inputs to be pushed in next array step
  return { x, y, operator, inputCount };
}

// Calculate result when "=" is entered/clicked
btnCalculate.addEventListener("click", operate);

// ////////////////END///////////////

function disableHideHistoryButton() {
  if (inputArray.length === 0) {
    console.log("disabled");
    btnGetHistory.disabled = true;
    btnGetHistory.style.opacity = "0";
  }
}

let inputOutputArray: string[] = [];

btnClearArray.forEach((btn) => {
  btn.addEventListener("click", async () => {
    if (btn.value === "AC") {
      inputArray = [];
      resultInputArray = [];
      countResultsForHistory = 0;
      savedCurrentOperateHistory = "";
      inputOutputArray = [];
      cacheOperatorsArray = [];
      cacheDigitsArray = [];
      cacheResultsArray = [];
      disableHideHistoryButton();
      console.clear();
    }
    // AC & C common functionality
    outputDisplay.textContent = "0";
    inputHistory.textContent = "Ans = 0";
    inputCount = 0;
    operatorCount = 0;
    valString = "";
    data = 0;
    resetValues(x, y, operator);
  });
});

disableHideHistoryButton();

// HISTORY

let toggled = false;
btnGetHistory.addEventListener("click", () => {
  if (!toggled) {
    toggled = true;
  } else {
    toggled = false;
  }
  if (
    inputArray.length > 0 &&
    countResultsForHistory < resultInputArray.length
  ) {
    const saveHistoryResult = resultInputArray.join(" ");
    console.log({ saveHistoryResult });
    let inputOutput = "";
    for (let i = countResultsForHistory; i < resultInputArray.length; i += 1) {
      inputOutput = ` ${inputArray[i]} = ${resultInputArray[i]} `;
      inputOutputArray.push(inputOutput);
    }
    countResultsForHistory = resultInputArray.length;
  }
  if (toggled) {
    inputHistory.textContent = inputOutputArray;
    toggled = true;
  } else {
    inputHistory.textContent = savedCurrentOperateHistory;
    toggled = false;
  }
});
