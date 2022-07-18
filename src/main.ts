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
const DATA = {
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
  result: 0,
};

const REGEX = {
  numberDigitOnly: /([0-9])/gm,
  operandsOnly: /(-|÷|\+|\*)/gm,
  operandPositiveLookbehind: /.(?<=(-|÷|\*|\+))/, // gets all the operators groups
};

/* 

/.(?<=(-|÷|\*|\+))/gm
/(-|÷|\*|\+)/gm 
*/

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
  isOperator(DATA.MAP_VALUES_HANDLE.get(count - 1));

const prevValIsAlsoPeriod = (val: string, count: number): boolean =>
  val === "." && count > 0 && DATA.MAP_VALUES_HANDLE.get(count - 1) === ".";

function handleAllBtn(
  btn: HTMLButtonElement,
  clickCountBtn: number
): Map<any, any> | undefined {
  const val = btn.value;
  const count = clickCountBtn;
  if (prevValIsAlsoOperator(val, count)) return undefined;
  if (prevValIsAlsoPeriod(val, count)) return undefined;
  const currVal = DATA.MAP_VALUES_HANDLE.set(count, val);

  return currVal;
}

// When an operator is clicked
function filterBtnInputs(
  fetchDataMap: Map<any, any>
): (string | number)[] | undefined {
  let currOp;
  let currNum;
  let result;
  const currData: string = fetchDataMap.get(DATA.countBtnClick);
  if (typeof parseFloat(currData) === "number") {
    const currCount = DATA.countFilterNumbers;
    currNum = currData;
    // DATA.MAP_FILTER_NUM.set(currCount, currNum);
    result = [currCount, currNum];
  }
  if (isOperator(currData)) {
    const currCount = DATA.countFilterOperators;
    currOp = currData;
    // DATA.MAP_FILTER_OP.set(currCount, currOp);
    result = [currCount, currOp];
  }

  return result;
}

function handleCacheDataFilterMap(getValidNumAndOp: Map<any, any>): void {
  const currData: string = getValidNumAndOp.get(DATA.countBtnClick);
  if (typeof parseFloat(currData) === "number") {
    const currCount = DATA.countFilterNumbers;
    DATA.MAP_FILTER_NUM.set(currCount, currData);
  }
  if (isOperator(currData)) {
    const currCount = DATA.countFilterOperators;
    DATA.MAP_FILTER_OP.set(currCount, currCount);
  }
}

// Populate Numbers & Operators in Cache
function populateDataInCache(
  getFilteredNumOpArr: (string | number)[] | undefined
): void {
  if (!getFilteredNumOpArr) throw new Error("string, num not found");
  const currCount = DATA.countBtnClick;
  DATA.MAP_DATA.set(currCount, getFilteredNumOpArr[1]);
}

// //// CENTRAL HUB FOR ALL PROCESSING ////
function mainHubNumOp(btn: HTMLButtonElement): (string | number)[] | undefined {
  // #1 Handle & Filter Numbers
  const getValidNumAndOp = handleAllBtn(btn, DATA.countBtnClick);
  if (!getValidNumAndOp) return undefined;
  const getFilteredNumOpArr = filterBtnInputs(getValidNumAndOp);
  if (!getFilteredNumOpArr) throw new Error("undefined");

  // #! Set DATA
  handleCacheDataFilterMap(getValidNumAndOp);

  // #2 Update count for num & op
  if (isOperator(getFilteredNumOpArr[1])) DATA.countFilterOperators += 1;
  else DATA.countFilterNumbers += 1;
  DATA.countBtnClick += 1;

  // #3 Populate Numbers & Operators in Cache
  const currNumOp = getFilteredNumOpArr;
  if (!currNumOp) throw new Error(`${currNumOp} is not found""`);
  populateDataInCache(currNumOp);

  return getFilteredNumOpArr; // this is enough. calculate rest in an async function
}

function updateDisplay(currNumOp: (string | number)[] | undefined) {
  if (!currNumOp) throw new Error("Cannot find mainHubNumOp result");
  outputDisplay.innerText =
    outputDisplay.innerText.toString().trimEnd() + currNumOp[1].toString();
}

function flattenDataMapCache(mappedData: Map<number, string | number>) {
  const arrData: (string | number)[] = [];
  const data: Map<number, string | number> = mappedData;
  if (!data) throw new Error();
  for (let i = 1; i <= data.size; i += 1) {
    const currData = data.get(i);
    if (!currData) throw new Error();
    arrData.push(currData);
  } // end of for loop
  if (!arrData.filter((item) => (typeof item === "undefined") as boolean)) {
    throw new Error("arrData has an undefined item");
  }

  return { data, arrData };
}

function compute() {
  // #1 Flatten Map to Array
  const mappedData = DATA.MAP_DATA;
  const { data, arrData } = flattenDataMapCache(mappedData);
  // #2 Convert Array to a string
  const arrDataCopy = arrData; // (7) ['2', '2', '3', '3', '+', '6', '6']
  const strJoinArrData = arrDataCopy.join("").trim(); // '2233+66'
  // #3 Group up strings separated by operand
  const regexIsNumber = REGEX.numberDigitOnly;
  const regexIsOperands = REGEX.operandsOnly; // Learn RegEx in 20 minutes --> WebDevSimplified
  // const isNumber = regexIsNumber.test(strJoinArrData);
  // const isOperand = regexIsOperands.test(strJoinArrData);
  const numbersFromString = strJoinArrData.replace(regexIsOperands, " ");
  const operandsFromString = strJoinArrData.replace(regexIsNumber, " ");
  const arrNumbers = numbersFromString.split(" ");
  const arrOperands = operandsFromString
    .split(" ")
    .filter((item) => item !== " " && item !== "");
  // eslint-disable-next-line no-console
  console.log({ arrNumbers, arrOperands, numbersFromString, operandsFromString, }); // prettier-ignore

  // #4 Allocate num & operator from arrays to prev & curr & operator
  let strPrev = arrNumbers[0];
  DATA.strPrevCopy = strPrev; // TODO Remember to reset this value on AC (ALL CLEAR)
  if (strPrev !== DATA.strPrevCopy) {
    if (!DATA.result) throw new Error("DATA.result is undefined");
    strPrev = DATA.result.toString();
  }
  // Set first result in array to first number
  DATA.result = parseFloat(strPrev);

  let result;
  let strCurr;
  let strOperand;
  const floatPrev = parseFloat(strPrev);
  let floatCurr;
  let strNext;
  let floatNext;

  // #6 Iterate and get result from array
  for (let i = 1; i < arrNumbers.length; i += 1) {
    strCurr = arrNumbers[i];
    strNext = arrNumbers[i + 1];

    // eslint-disable-next-line no-console
    console.log({ strPrev, strCurr, strNext });

    if (!strPrev || !strCurr) throw new Error();
    floatCurr = parseFloat(strCurr);
    floatNext = parseFloat(strNext);

    strOperand = arrOperands[i - 1];
    if (!strOperand) throw new Error();
    // eslint-disable-next-line no-console
    console.log({ strOperand });

    if (!floatPrev || !floatCurr) throw new Error();
    if (!floatNext) {
      result = operatePrevCurr(DATA.result, floatCurr, strOperand);
    } else {
      result = operatePrevCurr(DATA.result, floatCurr, strOperand);
    }
    if (!result) throw new Error();
    DATA.result = result;
  }

  // #5 Cache the result to Global DATA.result cache

  // eslint-disable-next-line no-console
  // console.log({ data, arrData, arrDataCopy, strJoinArrData, result });
  // eslint-disable-next-line no-console
  console.log({ result });

  return [data, arrData, result, arrDataCopy, strJoinArrData];
}

// ////////////// BTN EVENT LISTEN /////////////

for (let i = 0; i < MAP_BTN_CACHE.size; i += 1) {
  const currBtn = MAP_BTN_CACHE.get(i);
  if (isNumAndOperator(currBtn) || currBtn.value === ".") {
    MAP_BTN_CACHE.get(i).addEventListener("click", () => {
      const clickedBtn: HTMLButtonElement = MAP_BTN_CACHE.get(i);
      // MAIN ENTRYPOINT
      const currNumOp = mainHubNumOp(clickedBtn);
      // DOM UI CLIENT STUFF
      if (!currNumOp) throw new Error("Cannot find mainHubNumOp() result");
      updateDisplay(currNumOp);
    }); // end of event listener
  } else {
    const clickedUtilBtn: HTMLButtonElement = MAP_BTN_CACHE.get(i);
    DATA.MAP_BTN_UTIL_CACHE.set(i, clickedUtilBtn);
  }
} // end of for loop

// FIXME filter out clear buttons

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
  DATA.isBackspace = true;
  // if isOperator
  DATA.MAP_FILTER_OP.delete(DATA.countFilterOperators - 1);
  DATA.countFilterOperators -= 1;
  DATA.isBackspace = false;
  // if isNumber
  DATA.MAP_FILTER_NUM.delete(DATA.countFilterNumbers - 1);
  DATA.countFilterNumbers -= 1;
  DATA.isBackspace = false;
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
