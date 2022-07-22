import "./style.css";
// eslint-disable-next-line import/no-unresolved, import/extensions
import { drawData } from "./charts/drawData";
// eslint-disable-next-line import/no-unresolved, import/extensions
import { drawLineOnCanvas, fillBlankOnCanvas } from "./canvas/canvas";
// eslint-disable-next-line import/no-unresolved, import/extensions
import { isOperator } from "./utils/isOperator";
// eslint-disable-next-line import/no-unresolved, import/extensions
import { operatePrevCurr } from "./functions/operatePrevCurr";

// /////////////////////////APP///////
const app = document.querySelector<HTMLDivElement>("#app")!;
const appClass = app.className;
appClass.toLowerCase();

// ///////////////////////CHARTS D3///
const d3Article = document.getElementById("d3");
export const d3Label = document.getElementById("d3Label") as HTMLLabelElement;
export const btnD3Category = document.getElementById("btnD3Category") as HTMLButtonElement; // prettier-ignore

if (!d3Article) throw new Error("d3 not found");
export const d3Array: any[] = [];
drawData(); // D3 DATA RENDERING !!!!

// ////////////////CONSTANTS/////////
const btnAll: HTMLButtonElement[] = Array.from(document.getElementsByTagName("button")); // prettier-ignore
const MAP_BTN_CACHE = new Map();

for (let i = 0; i < btnAll.length; i += 1) MAP_BTN_CACHE.set(i, btnAll[i]);

export const outputDisplay = document.querySelector("#output") as HTMLOutputElement; // prettier-ignore
export const inputHistory = document.querySelector("#inputHistory") as any;
export const btnDecimal = document.getElementById("btnDecimal") as HTMLButtonElement; // prettier-ignore
const btnCalculate = document.getElementById("btnResultEquals") as HTMLButtonElement; // prettier-ignore

// ////////////////CANVAS////////////
const outputVal = outputDisplay.textContent;
if (!outputVal) throw new Error("outputVal is not defined");

export const output = parseInt(outputVal, 10); // animate canvas with a variable

// Animate the canvas at intervals
// prettier-ignore
const animateCanvas = (drawTime: number | undefined, blankTime: number | undefined) => {
  setInterval(drawLineOnCanvas, drawTime);
  setInterval(fillBlankOnCanvas, blankTime);
};

// ////////////////DRAW CANVAS//////////
const drawCanvas = () => animateCanvas(1000, 1000);
drawCanvas();

// ////////////////LOGIC///////////////
const STATE = {
  countBtnClick: 0,
  MAP_VALUES_HANDLE: new Map(),
  MAP_FILTER_NUM: new Map(),
  MAP_FILTER_OP: new Map(),
  countFilterNumbers: 0,
  countFilterOperators: 0,
  reqToCalculate: false,
  countMainHub: 0,
  countOperator: 0,
  markerOperator: 0,
  isBackspace: false,
  MAP_DATA: new Map<number, string | number>(),
  MAP_NUMBERS: new Map<number, number>(),
  MAP_OPERATOR: new Map<number, string>(),
  MAP_BTN_UTIL_CACHE: new Map(), // AC, C, ..
  strPrevCopy: "",
  resultCache: 0,
  result: 0,
  countCompute: 0,
  capturedDisplayData: "",
};

const REGEX = {
  regexIsNumber: /([0-9])/gm,
  regexIsOperator: /(-|÷|\+|\*)/gm,
  regexIsOperatorPositiveLookbehind: /.(?<=(-|÷|\*|\+))/, // gets all the operators groups
};

export const operatorIsClicked = (val: string) => val === "-" || val === "+" || val === "*" || val === "÷"; // prettier-ignore

function isNumAndOperator(btn: HTMLButtonElement) {
  const curr = btn.value;
  const regex = /[0-9]/gm;
  const matchCurrRegexNum = curr.match(regex)?.join("");
  const currIsOperator = isOperator(curr);
  let currIsNumber;
  if (matchCurrRegexNum) currIsNumber = typeof parseFloat(matchCurrRegexNum) === "number"; // prettier-ignore
  if (currIsNumber) return true;
  if (currIsOperator) return true;

  return false;
}

const prevValIsAlsoOperator = (value: string, count: number): boolean =>
  count > 0 &&
  isOperator(value) &&
  isOperator(STATE.MAP_VALUES_HANDLE.get(count - 1));

const prevValIsAlsoPeriod = (val: string, count: number): boolean =>
  val === "." && count > 0 && STATE.MAP_VALUES_HANDLE.get(count - 1) === ".";

// prettier-ignore
function handleAllBtn(btn: HTMLButtonElement, clickCountBtn: number): Map<any, any> | undefined {
  const val = btn.value;
  const count = clickCountBtn;
  if (prevValIsAlsoOperator(val, count)) return undefined;
  if (prevValIsAlsoPeriod(val, count)) return undefined;
  const currVal = STATE.MAP_VALUES_HANDLE.set(count, val);

  return currVal;
}

// When an operator is clicked
// prettier-ignore
function filterBtnInputs(fetchDataMap: Map<any, any>): (string | number)[] | undefined {
  let currOp;
  let currNum;
  let result;
  const currData: string = fetchDataMap.get(STATE.countBtnClick);
  if (typeof parseFloat(currData) === "number") {
    const currCount = STATE.countFilterNumbers;
    currNum = currData;
    result = [currCount, currNum];
  }
  if (isOperator(currData)) {
    const currCount = STATE.countFilterOperators;
    currOp = currData;
    result = [currCount, currOp];
  }

  return result;
}

function handleHubMapFilterState(getValidNumAndOp: Map<any, any>): void {
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

function updateDisplay(currNumOp: (string | number)[] | undefined) {
  if (!currNumOp) throw new Error("Cannot find mainHubNumOp result");
  outputDisplay.innerText = outputDisplay.innerText.toString().trimEnd() + currNumOp[1].toString(); // prettier-ignore
  const captureDisplayData = outputDisplay.innerText;
  STATE.capturedDisplayData = captureDisplayData;
}

function displayResult() {
  outputDisplay.innerText = STATE.resultCache.toFixed(2).toString();
}

function displayHistory() {
  inputHistory.innerText = STATE.capturedDisplayData.trim();
}

function flattenDataMapCache(mappedData: Map<number, string | number>) {
  const arrData: (string | number)[] = [];
  const data: Map<number, string | number> = mappedData;
  for (let i = 1; i <= data.size; i += 1) {
    const currData = data.get(i);
    if (!currData) throw new Error();
    arrData.push(currData);
  } // end of for loop
  if (!arrData.filter((item) => (typeof item === "undefined") as boolean)) throw new Error("arrData has an undefined item"); // prettier-ignore

  return { data, arrData };
}

const itemExists = (item: string): unknown => item !== " " && item !== "" && item !== "."; // prettier-ignore

// //// CENTRAL HUB FOR ALL PROCESSING ////
function mainHubNumOp(btn: HTMLButtonElement): (string | number)[] | undefined {
  // #1 Handle & Filter Numbers
  const getValidNumAndOp = handleAllBtn(btn, STATE.countBtnClick);
  if (!getValidNumAndOp) return undefined;
  const getFilteredNumOpArr = filterBtnInputs(getValidNumAndOp);
  if (!getFilteredNumOpArr) throw new Error("undefined");
  handleHubMapFilterState(getValidNumAndOp); // #! Set DATA
  // #2 Update count for num & op
  if (isOperator(getFilteredNumOpArr[1])) STATE.countFilterOperators += 1;
  else STATE.countFilterNumbers += 1;
  STATE.countBtnClick += 1; // Increment count
  // #3 Populate Numbers & Operators in Cache
  STATE.MAP_DATA.set(STATE.countBtnClick, getFilteredNumOpArr[1]);

  return getFilteredNumOpArr; // this is enough. calculate rest in an async function
}

// prettier-ignore
function computeLoop(arrNumbers: string[], arrOperators: string[], floatPrev: number, result: any) {
  let res = result;
  let strCurr; let floatCurr; let strOperator; // prettier-ignore
  for (let i = 1; i < arrNumbers.length; i += 1) {
    strCurr = arrNumbers[i];
    strOperator = arrOperators[i - 1];
    floatCurr = parseFloat(strCurr);
    if (!strOperator) throw new Error(); // This also blocks any processing when = is pressed
    if (!floatPrev || !floatCurr) throw new Error();
    // #6 Compute Result with each iteration
    if (i <= 1) res = operatePrevCurr(floatPrev, floatCurr, strOperator);
    else res = operatePrevCurr(STATE.resultCache, floatCurr, strOperator);
    // #7 Cache the result to Global DATA.result cache
    if (!res) throw new Error();

    STATE.resultCache = res;
  } // end of for loop

  return res;
}

function compute() {
  // #1 Flatten Map to Array
  const mappedData = STATE.MAP_DATA;
  const { arrData } = flattenDataMapCache(mappedData);
  // #2 Convert Array to a string
  const arrDataCopy = arrData; // (7) ['2', '2', '3', '3', '+', '6', '6']
  const strJoinArrData = arrDataCopy.join("").trim();
  const arrNumbers = strJoinArrData.replace(REGEX.regexIsOperator, " ").split(" "); // prettier-ignore
  const arrOperator = strJoinArrData.replace(REGEX.regexIsNumber, " ").split(" ").filter((item) => itemExists(item)); // prettier-ignore
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

// ////////////// BTN EVENT LISTEN /////////////

function addEventListenersToBtn() {
  for (let i = 0; i < MAP_BTN_CACHE.size; i += 1) {
    const currBtn = MAP_BTN_CACHE.get(i);
    if (isNumAndOperator(currBtn) || currBtn.value === ".") {
      MAP_BTN_CACHE.get(i).addEventListener("click", () => {
        const clickedBtn: HTMLButtonElement = MAP_BTN_CACHE.get(i);
        const currNumOp = mainHubNumOp(clickedBtn); // MAIN ENTRYPOINT
        if (!currNumOp) throw new Error("Cannot find mainHubNumOp() result");
        updateDisplay(currNumOp); // DOM UI CLIENT STUFF
      }); // end of event listener
    } else {
      const clickedUtilBtn: HTMLButtonElement = MAP_BTN_CACHE.get(i);
      STATE.MAP_BTN_UTIL_CACHE.set(i, clickedUtilBtn);
    }
  } // end of for loop
}

addEventListenersToBtn();

// Calculate result when "=" is entered/clicked
btnCalculate.addEventListener("click", () => {
  STATE.countCompute += 1; // #6 RESET STATE so prev mappedData is reset & mainHubNumOp state setting of MAP_DATA is reset
  const result = compute();
  if (!result) throw new Error("result not found");
  STATE.resultCache = result; // #8 Increment DATA compute counter - fetch the prev val from array then
  displayResult();
  displayHistory();
});

// //// END OF SCRIPT ////
