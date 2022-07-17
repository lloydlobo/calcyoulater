import "./style.css";
// eslint-disable-next-line import/no-unresolved, import/extensions
import { drawData } from "./charts/drawData";
// eslint-disable-next-line import/no-unresolved, import/extensions
import { drawLineOnCanvas, fillBlankOnCanvas } from "./canvas/canvas";
// eslint-disable-next-line import/no-unresolved, import/extensions
import { isOperator } from "./utils/isOperator";
// import { isANumberOnly } from "./utils/isANumberOnly";
// import { isOperator } from "./utils/isOperator";
// import { operatePrevCurr } from "./functions/operatePrevCurr";

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
// D3 DATA RENDERING !!!!
drawData();

// ////////////////CONSTANTS/////////
export const outputDisplay = document.querySelector("#output") as HTMLOutputElement; // prettier-ignore
export const inputHistory = document.querySelector("#inputHistory") as any;
export const btnDecimal = document.getElementById("btnDecimal") as HTMLButtonElement; // prettier-ignore

const btnAll: HTMLButtonElement[] = Array.from(
  document.getElementsByTagName("button")
);

const MAP_BTN_CACHE = new Map();

for (let i = 0; i < btnAll.length; i += 1) {
  MAP_BTN_CACHE.set(i, btnAll[i]);
}
// eslint-disable-next-line no-console
console.log(MAP_BTN_CACHE);
const btnClear = document.getElementById("btnClear") as HTMLButtonElement;
const btnAllClear = document.getElementById("btnAllClear") as HTMLButtonElement;
const btnClearArray = [btnClear, btnAllClear];
const btnGetHistory = document.getElementById("btnHistory") as HTMLButtonElement; // prettier-ignore
const btnCalculate = document.getElementById("btnResultEquals") as HTMLButtonElement; // prettier-ignore
const btnBackspaceClear = document.getElementById("btnClear") as HTMLButtonElement; // prettier-ignore
// const allBtn: HTMLButtonElement[] = [];
// Spread btnAll to access forEach method
// const allButtons = [...btnAll];

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

export const valString = "";
// ////////////////LOGIC///////////////

const MAIN_CACHE = {
  clickCountNumAndOpBtn: 0,
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
  MAP_DATA: new Map(),
  MAP_NUMBERS: new Map<number, number>(),
  MAP_OPERATOR: new Map<number, string>(),
  MAP_BTN_UTIL_CACHE: new Map(), // AC, C, ..
};

function isNumAndOperator(btn: HTMLButtonElement) {
  const curr = btn.value;
  const regex = /[0-9]/gm;
  const matchCurrRegexNum = curr.match(regex)?.join("");
  const currIsOperator = isOperator(curr);
  let currIsNumber;
  if (matchCurrRegexNum) {
    currIsNumber = typeof parseFloat(matchCurrRegexNum) === "number";
  }
  if (currIsNumber) return true;
  if (currIsOperator) return true;
  // if (!matchCurrRegexNum) return false; // disabled as regex isn't checking for operators
  return false;
}

function handleAllBtn(btn: HTMLButtonElement, clickCountBtn: number) {
  const val = btn.value;
  const count = clickCountBtn;

  const prevValIsAlsoPeriod = val === '.' && MAIN_CACHE.MAP_VALUES_HANDLE.get(count - 1) === '.' && count > 0;

  if (prevValIsAlsoPeriod) return;
  const currVal = MAIN_CACHE.MAP_VALUES_HANDLE.set(count, val);
  return currVal;
}

// keep track of when the operator is hit to set a marker
// TODO get count of current number cache count and operator count and add both to marker count
// When an operator is clicked
function filterBtnInputs(fetchDataMap: Map<any, any>) {
  let currOp;
  let currNum;
  let result;
  const currData: string = fetchDataMap.get(MAIN_CACHE.clickCountNumAndOpBtn);
  if (typeof parseFloat(currData) === "number") {
    const currCount = MAIN_CACHE.countFilterNumbers;
    currNum = currData;
    MAIN_CACHE.MAP_FILTER_NUM.set(currCount, currNum);
    result = [currCount, currNum];
  }
  if (isOperator(currData)) {
    const currCount = MAIN_CACHE.countFilterOperators;
    currOp = currData;
    MAIN_CACHE.MAP_FILTER_OP.set(currCount, currOp);
    result = [currCount, currOp];
  }

  return result;
}

const getNumbers = (numbers: Map<number, number>) =>
  numbers.get(MAIN_CACHE.countMainHub);
const getOperators = (operator: Map<number, string>) =>
  operator.get(MAIN_CACHE.countMainHub);

function requestToOperate() {
  if (!MAIN_CACHE.reqToCalculate) {
    MAIN_CACHE.reqToCalculate = true;
    return true;
  }
  MAIN_CACHE.reqToCalculate = false;
  return false;
}

// //// CENTRAL HUB FOR ALL PROCESSING ////
function mainHubNumOp(btn: HTMLButtonElement) {
  // #1 Handle & Filter Numbers
  const getHandleValAndCount = handleAllBtn(btn, MAIN_CACHE.clickCountNumAndOpBtn); // prettier-ignore
  if (!getHandleValAndCount) return
  const getFilteredNumOpArr = filterBtnInputs(getHandleValAndCount);
  console.log("file: main.ts | line 159 | mainHubNumOp | getFilteredNumOpArr", getFilteredNumOpArr);

  if (!getFilteredNumOpArr) throw new Error("string, num not found or invalid or undefined");

  // #2 Update count for num & op
  if (isOperator(getFilteredNumOpArr[1])) MAIN_CACHE.countFilterOperators += 1; // prettier-ignore
  // const resOperators = getOperators(MAP_OPERATOR);
  else MAIN_CACHE.countFilterNumbers += 1;
  // const resNumbers = getNumbers(MAP_NUMBERS);


  MAIN_CACHE.clickCountNumAndOpBtn += 1;

  return getFilteredNumOpArr; // this is enough. calculate in an async function separately
}

// #2 Populate Numbers & Operators in Cache
function populateDataInCache(getFilteredNumOpArr: (string | number)[] | undefined) {
  if (!getFilteredNumOpArr)
    throw new Error("string, num not found");
  const currCount = MAIN_CACHE.clickCountNumAndOpBtn;
  MAIN_CACHE.MAP_DATA.set(currCount, getFilteredNumOpArr[1]);
}

function updateDisplay(currNumOp: (string | number)[] | undefined) {
  if (!currNumOp) throw new Error("Cannot find mainHubNumOp result");
  outputDisplay.innerText =
    outputDisplay.innerText.toString().trimEnd()
    +
    (currNumOp[1]).toString();
}

function compute() {
  const len = MAIN_CACHE.MAP_DATA.size;
  console.log("compute", { len }, (MAIN_CACHE.MAP_DATA))

}

// ////////////// BTN EVENT LISTEN /////////////
for (let i = 0; i < MAP_BTN_CACHE.size; i += 1) {
  const currBtn = MAP_BTN_CACHE.get(i);
  if (isNumAndOperator(currBtn) || currBtn.value === '.') {
    MAP_BTN_CACHE.get(i).addEventListener("click", () => {
      const clickedBtn: HTMLButtonElement = MAP_BTN_CACHE.get(i);

      // MAIN ENTRYPOINT
      const currNumOp = mainHubNumOp(clickedBtn);
      if (!currNumOp) throw new Error(currNumOp + ' is not found""');
      populateDataInCache(currNumOp);

      // DOM UI CLIENT STUFF
      if (!currNumOp) throw new Error("Cannot find mainHubNumOp() result");
      updateDisplay(currNumOp);
    });
  } else {
    const clickedUtilBtn: HTMLButtonElement = MAP_BTN_CACHE.get(i);

    MAIN_CACHE.MAP_BTN_UTIL_CACHE.set(i, clickedUtilBtn);
  }
} // FIXME filter out clear buttons

// Calculate result when "=" is entered/clicked
btnCalculate.addEventListener("click", compute);

// // EVENT LISTENERS //
// FIXME duplicate clear buttons btnClear & btnBackspaceClear
btnClearArray.forEach((btn) =>
  btn.addEventListener("click", async () => {
    // eslint-disable-next-line no-console
    console.log(btn);
  })
);

btnBackspaceClear.addEventListener("click", () => {
  // TODO
  MAIN_CACHE.isBackspace = true;
  // if isOperator
  MAIN_CACHE.MAP_FILTER_OP.delete(MAIN_CACHE.countFilterOperators - 1);
  MAIN_CACHE.countFilterOperators -= 1;
  MAIN_CACHE.isBackspace = false;
  // if isNumber
  MAIN_CACHE.MAP_FILTER_NUM.delete(MAIN_CACHE.countFilterNumbers - 1);
  MAIN_CACHE.countFilterNumbers -= 1;
  MAIN_CACHE.isBackspace = false;
});
btnGetHistory.addEventListener("click", () => {
  // eslint-disable-next-line no-console
  console.log("gtHist");
});

// btnDecimal.removeEventListener(
//   "click",
//   () => {
//     // eslint-disable-next-line no-console
//     console.log(";remove");
//   },
//   false
// );
// btnDecimal.addEventListener("click", () => {
//   // eslint-disable-next-line no-console
//   console.log("addDecimal");
// });

// //// END OF SCRIPT ////

/*
######## ##    ## ########
##       ###   ## ##     ##
##       ####  ## ##     ##
######   ## ## ## ##     ##
##       ##  #### ##     ##
##       ##   ### ##     ##
######## ##    ## ########
 */

// Return value from eventlistener
// const someObject = { aProperty: "Data" };
// btnCalculate.addEventListener("click", () => {
//   // eslint-disable-next-line no-console
//   console.log(someObject.aProperty); // Expected Value: 'Data'
//   someObject.aProperty = "Data Again"; // Change the value
// });

// window.setInterval(() => {
//   if (someObject.aProperty === "Data Again") {
//     // eslint-disable-next-line no-console
//     console.log("Data Again: True");
//     someObject.aProperty = "Data"; // Reset value to wait for next event execution
//   }
// }, 5000);

// FIXME if the curr data or last data is number then delete what?
// FIXME problem is we are'nt concatenating numbers yet. so gotta
