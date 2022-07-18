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
export const btnD3Category = document.getElementById(
  "btnD3Category"
) as HTMLButtonElement;

if (!d3Article) throw new Error("d3 not found");
export const d3Array: any[] = [];
drawData(); // D3 DATA RENDERING !!!!

// ////////////////CONSTANTS/////////
const btnAll: HTMLButtonElement[] = Array.from(
  document.getElementsByTagName("button")
);
const MAP_BTN_CACHE = new Map();
for (let i = 0; i < btnAll.length; i += 1) MAP_BTN_CACHE.set(i, btnAll[i]);

export const outputDisplay = document.querySelector(
  "#output"
) as HTMLOutputElement;
export const inputHistory = document.querySelector("#inputHistory") as any;
export const btnDecimal = document.getElementById(
  "btnDecimal"
) as HTMLButtonElement;

const btnClear = document.getElementById("btnClear") as HTMLButtonElement;
const btnAllClear = document.getElementById("btnAllClear") as HTMLButtonElement;
const btnClearArray = [btnClear, btnAllClear];
const btnGetHistory = document.getElementById(
  "btnHistory"
) as HTMLButtonElement;
const btnCalculate = document.getElementById(
  "btnResultEquals"
) as HTMLButtonElement;
const btnBackspaceClear = document.getElementById(
  "btnClear"
) as HTMLButtonElement;

// ////////////////CANVAS////////////
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

// FIXME REGEX "panics" when numbers have decimals in them ==> strOperator: "."
const REGEX = {
  regexIsNumber: /([0-9])/gm,
  regexIsOperator: /(-|÷|\+|\*)/gm,
  regexIsOperatorPositiveLookbehind: /.(?<=(-|÷|\*|\+))/, // gets all the operators groups
};

export const operatorIsClicked = (val: string) =>
  val === "-" || val === "+" || val === "*" || val === "÷";

function isNumAndOperator(btn: HTMLButtonElement) {
  const curr = btn.value;
  const regex = /[0-9]/gm;
  const matchCurrRegexNum = curr.match(regex)?.join("");
  const currIsOperator = isOperator(curr);
  let currIsNumber;
  if (matchCurrRegexNum)
    currIsNumber = typeof parseFloat(matchCurrRegexNum) === "number";
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

function handleAllBtn(
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

// When an operator is clicked
function filterBtnInputs(
  fetchDataMap: Map<any, any>
): (string | number)[] | undefined {
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
  outputDisplay.innerText =
    outputDisplay.innerText.toString().trimEnd() + currNumOp[1].toString();
  const captureDisplayData = outputDisplay.innerText;
  STATE.capturedDisplayData = captureDisplayData;
}

function flattenDataMapCache(mappedData: Map<number, string | number>) {
  const arrData: (string | number)[] = [];
  const data: Map<number, string | number> = mappedData;
  // eslint-disable-next-line no-console
  console.log("mappedData flatten", mappedData);
  // if (!data) throw new Error();
  for (let i = 1; i <= data.size; i += 1) {
    const currData = data.get(i);
    if (!currData) throw new Error();
    arrData.push(currData);
  } // end of for loop
  if (!arrData.filter((item) => (typeof item === "undefined") as boolean))
    throw new Error("arrData has an undefined item");

  return { data, arrData };
}

function itemExists(item: string): unknown {
  return item !== " " && item !== "" && item !== ".";
}

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
  // FIXME change state before return --> fix prevNum for loop i = 0 then
  STATE.countBtnClick += 1; // Increment count
  // #3 Populate Numbers & Operators in Cache
  STATE.MAP_DATA.set(STATE.countBtnClick, getFilteredNumOpArr[1]);

  return getFilteredNumOpArr; // this is enough. calculate rest in an async function
}

function computeLoop(
  arrNumbers: string[],
  arrOperators: string[],
  floatPrev: number,
  result: any
) {
  let res = result;
  // eslint-disable-next-line no-console
  console.log("computeLoop()", { arrNumbers, arrOperators, floatPrev, res });
  let strCurr;
  let floatCurr;
  let strOperator;
  let strNext;
  for (let i = 1; i < arrNumbers.length; i += 1) {
    strCurr = arrNumbers[i];
    strNext = arrNumbers[i + 1];
    strOperator = arrOperators[i - 1];
    floatCurr = parseFloat(strCurr);
    if (!strOperator) throw new Error(); // This also blocks any processing when = is pressed
    if (!floatPrev || !floatCurr) throw new Error();
    // #6 Compute Result with each iteration
    if (i <= 1) res = operatePrevCurr(floatPrev, floatCurr, strOperator);
    else res = operatePrevCurr(STATE.resultCache, floatCurr, strOperator);
    // eslint-disable-next-line no-console
    console.log(i, {
      floatPrev,
      res,
      strCurr,
      strNext,
      strOperator,
      floatCurr,
    });
    // #7 Cache the result to Global DATA.result cache
    if (!res) throw new Error();
    STATE.resultCache = res;
  } // end of for loop

  return res;
}

function compute() {
  // eslint-disable-next-line no-console
  console.log("compute is clicked");
  // #1 Flatten Map to Array
  const mappedData = STATE.MAP_DATA;
  // eslint-disable-next-line no-console
  console.log("mappedData compute", mappedData);
  const { arrData } = flattenDataMapCache(mappedData);
  // #2 Convert Array to a string
  const arrDataCopy = arrData; // (7) ['2', '2', '3', '3', '+', '6', '6']
  const strJoinArrData = arrDataCopy.join("").trim();
  const arrNumbers = strJoinArrData
    .replace(REGEX.regexIsOperator, " ")
    .split(" ");

  const arrOpe = strJoinArrData.replace(REGEX.regexIsNumber, " ");
  // eslint-disable-next-line no-console
  console.log({ strJoinArrData, arrOpe });
  const arrOperator = strJoinArrData
    .replace(REGEX.regexIsNumber, " ")
    .split(" ")
    .filter((item) => itemExists(item));
  // eslint-disable-next-line no-console
  console.log("compute", STATE.countCompute, {
    strJoinArrData,
    arrNumbers,
    arrOperator,
  });
  // #4 Allocate num & operator from arrays to prev & curr & operator
  let strPrev;
  if (STATE.countCompute > 1) strPrev = STATE.resultCache.toString();
  else if (STATE.countCompute === 1) strPrev = arrNumbers[0].toString();
  if (!strPrev) throw new Error();

  const floatPrev = parseFloat(strPrev);
  let result = floatPrev;
  // eslint-disable-next-line no-console
  console.log({ strPrev, floatPrev, result, arrNumbers, arrOperator });
  // FIXME arrNumbers is the culprit
  // #5 Iterate and get result from array
  result = computeLoop(arrNumbers, arrOperator, floatPrev, result); // end of for loop
  // if (STATE.countCompute === 1) {
  STATE.MAP_DATA.clear();
  STATE.countBtnClick = 1;
  STATE.MAP_DATA.set(1, result);
  // eslint-disable-next-line no-console
  console.log("cleared", STATE.MAP_DATA, STATE.MAP_DATA.size);
  // STATE.MAP_DATA.set(1, STATE.resultCache);
  // }
  if (!result) throw new Error();
  return result;
}

// TODO Reset the whole arrayNum when calculation is done
// ////////////// BTN EVENT LISTEN /////////////

for (let i = 0; i < MAP_BTN_CACHE.size; i += 1) {
  const currBtn = MAP_BTN_CACHE.get(i);
  if (isNumAndOperator(currBtn) || currBtn.value === ".") {
    MAP_BTN_CACHE.get(i).addEventListener("click", () => {
      // eslint-disable-next-line no-console
      console.log("STATE.MAP_DATA", STATE.MAP_DATA);
      const clickedBtn: HTMLButtonElement = MAP_BTN_CACHE.get(i);
      // MAIN ENTRYPOINT
      const currNumOp = mainHubNumOp(clickedBtn);
      // DOM UI CLIENT STUFF
      if (!currNumOp) throw new Error("Cannot find mainHubNumOp() result");
      updateDisplay(currNumOp);
    }); // end of event listener
  } else {
    const clickedUtilBtn: HTMLButtonElement = MAP_BTN_CACHE.get(i);
    STATE.MAP_BTN_UTIL_CACHE.set(i, clickedUtilBtn);
  }
} // end of for loop

function displayResult() {
  outputDisplay.innerText = STATE.resultCache.toFixed(2).toString();
}
function displayHistory() {
  inputHistory.innerText = STATE.capturedDisplayData.trim();
}
// Calculate result when "=" is entered/clicked
btnCalculate.addEventListener("click", () => {
  // #6 RESET STATE so prev mappedData is reset & mainHubNumOp state setting of MAP_DATA is reset
  STATE.countCompute += 1;
  const result = compute();
  if (!result) throw new Error("result not found");
  // #8 Increment DATA compute counter - fetch the prev val from array then
  // eslint-disable-next-line no-console
  console.log({ result });

  STATE.resultCache = result;

  displayResult();
  displayHistory();
});

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
  STATE.isBackspace = true;
  // if isOperator
  STATE.MAP_FILTER_OP.delete(STATE.countFilterOperators - 1);
  STATE.countFilterOperators -= 1;
  STATE.isBackspace = false;
  // if isNumber
  STATE.MAP_FILTER_NUM.delete(STATE.countFilterNumbers - 1);
  STATE.countFilterNumbers -= 1;
  STATE.isBackspace = false;
});
btnGetHistory.addEventListener("click", () => {
  // eslint-disable-next-line no-console
  console.log("gtHist");
});

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

// FIXME if the curr data or last data is number then delete what?
// FIXME problem is we are'nt concatenating numbers yet. so gotta

// TODO get count of current number cache count and operator count and add both to marker count

/* 
The Search of the fat cat street.
12+22+424-44÷444*999  

/(-|÷|\+|\*)/gm

/(t|e|r){2,3}/gm
/(t|e|r){2,3}\./gm  ==> eet.
rerere re rere  => /(re){2,3}/gm

.Hi ==> /^\./gm
hi. ==> /\.$
Lookbehind
1. Positive lookbehinds /(?<=[tT]he)./gm

Negative Lookbehind (?<![tT]he)

Positive Lookahead (?=at)
. matches any character (except for line terminators)

Negative Lookahead (?!at)



// PHONE NUMBERS

9876543210
1234567890
123-456-7890
123 456 7890
(323) 456-7890
+1 123 456 7890  (9.)

EXP MATCH
1. /[0-9]{10}/gm  (in a row)
2. /\d{10}/gm  (in a row)
3. /\d{3}-?\d{3}-?\d{4}/gm  (optional -)
4. /\d{3}\s?\d{3}\s?\d{4}/gm  (optional spaces)
5. /\d{3}[\s-]?\d{3}[\s-]?\d{4}/gm
6. /(\d{3})[\s-]?(\d{3})[\s-]?(\d{4})/gm  (capture digits)
7. /(?<areacode>\d{3})[\s-]?(\d{3})[\s-]?(\d{4})/gm
8. /\(?(?<areacode>\d{3})\)?[\s-]?(\d{3})[\s-]?(\d{4})/gm  (optional paranthesis with "\" escape char)
9. /(?:(\+1)[ -])?\(?(?<areacode>\d{3})\)?[\s-]?(\d{3})[\s-]?(\d{4})/gm
REPLACE
1. $1$2$3  (groupings due to ( ... ) in regex)


*/
/* 

/.(?<=(-|÷|\*|\+))/gm
/(-|÷|\*|\+)/gm 
*/
