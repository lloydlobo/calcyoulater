import "./style.css";
import { drawData as drawD3Data } from "./charts/drawData";
import { drawLineOnCanvas, fillBlankOnCanvas } from "./canvas/canvas";
import { compute } from "./logic/compute";
import { displayResult } from "./ui/displayResult";
import { displayHistory } from "./ui/displayHistory";
import { isNumAndOperator } from "./functions/isNumAndOperator";
import { updateDisplay } from "./ui/updateDisplay";
import { handleAllBtn } from "./functions/handleAllBtn";
import { filterBtnInputs } from "./functions/filterBtnInputs";
import { handleMapStateIfNumOrOperator } from "./handleMapStateIfNumOrOperator";
import { handleCountStateNumOperator } from "./handleCountStateNumOperator";
import { resetDisplayZeroToFirstNumberInput } from "./ui/resetDisplayZeroToFirstNumberInput";

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

// ////////////////CONSTANTS/////////
const btnAll: HTMLButtonElement[] = Array.from(document.getElementsByTagName("button")); // prettier-ignore
const btnAllClear = document.getElementById("btnAllClear") as HTMLButtonElement;
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

// ////////////////DRAW CANVAS//////////
// Animate the canvas at intervals
const animateCanvas = (
  drawTime: number | undefined,
  blankTime: number | undefined
) => {
  setInterval(drawLineOnCanvas, drawTime);
  setInterval(fillBlankOnCanvas, blankTime);
};

// //////////////// GLOBAL VARIABLES ///////////////
export const STATE = {
  capturedDisplayData: "",
  countBtnClick: 0,
  countCompute: 0,
  countFilterNumbers: 0,
  countFilterOperators: 0,
  countMainHub: 0,
  countOperator: 0,
  isBackspace: false,
  isComputed: false,
  MAP_BTN_UTIL_CACHE: new Map(), // AC, C, ..
  MAP_DATA: new Map<number, string | number>(),
  MAP_FILTER_NUM: new Map(),
  MAP_FILTER_OP: new Map(),
  MAP_NUMBERS: new Map<number, number>(),
  MAP_OPERATOR: new Map<number, string>(),
  MAP_VALUES_HANDLE: new Map(),
  markerOperator: 0,
  reqToCalculate: false,
  result: 0,
  resultCache: 0,
  strPrevCopy: "",
};

export const REGEX = {
  regexIsNumber: /([0-9])/gm,
  regexIsOperator: /(-|??|\+|\*)/gm,
  regexIsOperatorPositiveLookbehind: /.(?<=(-|??|\*|\+))/, // gets all the operators groups
};

function handleGlobalState(
  getValidNumAndOp: Map<any, any>,
  arrayNumAndOperator: (string | number)[]
) {
  const res = handleMapStateIfNumOrOperator(getValidNumAndOp);
  const key = res[0];
  const data = res[1];
  const isTrueIfOperator = res[2];

  // eslint-disable-next-line no-console
  console.log(res);
  // #1 Set DATA
  if (typeof isTrueIfOperator === "boolean" && typeof key === "number") {
    if (isTrueIfOperator) {
      STATE.MAP_FILTER_OP.set(key, data);
    } else {
      STATE.MAP_FILTER_NUM.set(key, data);
    }
  }
  // #2 Update count for num & op & each btn count
  if (handleCountStateNumOperator(arrayNumAndOperator)) {
    STATE.countFilterOperators += 1;
  } else {
    STATE.countFilterNumbers += 1;
  }
  STATE.countBtnClick += 1; // Increment count
  // #3 Populate Numbers & Operators in Cache
  STATE.MAP_DATA.set(STATE.countBtnClick, arrayNumAndOperator[1]);
  // eslint-disable-next-line no-console
  console.log(STATE);
}

// //// CENTRAL HUB FOR ALL PROCESSING ////
function mainHubNumOp(
  ev: HTMLButtonElement | KeyboardEvent
): (string | number)[] | undefined {
  // eslint-disable-next-line no-console
  console.log(ev.type);
  // #1 Handle & Filter Numbers
  const getValidNumAndOp = handleAllBtn(ev, STATE.countBtnClick);
  if (!getValidNumAndOp) return undefined;
  const arrayNumAndOperator = filterBtnInputs(getValidNumAndOp);
  if (!arrayNumAndOperator) return undefined;
  handleGlobalState(getValidNumAndOp, arrayNumAndOperator);

  return arrayNumAndOperator;
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
        resetDisplayZeroToFirstNumberInput();
        updateDisplay(currNumOp); // DOM UI CLIENT STUFF
      }); // end of event listener
    } else {
      const clickedUtilBtn: HTMLButtonElement = MAP_BTN_CACHE.get(i);
      STATE.MAP_BTN_UTIL_CACHE.set(i, clickedUtilBtn);
    }
  } // end of for loop
}

function calculateWhenCalled() {
  // #6 RESET STATE so prev mappedData is reset
  STATE.countCompute += 1;
  const result = compute();
  STATE.isComputed = true;
  // & mainHubNumOp state setting of MAP_DATA is reset
  STATE.resultCache = result; // #8 Increment DATA compute counter - fetch the prev val from array then
  displayResult();
  displayHistory();
}

// Calculate result when "=" is entered/clicked
function calculateBtnListener() {
  btnCalculate.addEventListener("click", () => {
    calculateWhenCalled();
  });
}

function main() {
  drawD3Data(); // D3 DATA RENDERING !!!!
  animateCanvas(1000, 1000);
  addEventListenersToBtn();
  calculateBtnListener();
}

main();

// //// END OF SCRIPT ////

function eraseAllData() {
  STATE.capturedDisplayData = "";
  STATE.countBtnClick = 0;
  STATE.countCompute = 0;
  STATE.countFilterNumbers = 0;
  STATE.countFilterOperators = 0;
  STATE.countMainHub = 0;
  STATE.countOperator = 0;
  STATE.isBackspace = false;
  STATE.isComputed = false;
  STATE.MAP_BTN_UTIL_CACHE = new Map(); // AC; C, ..
  STATE.MAP_DATA = new Map<number, string | number>();
  STATE.MAP_FILTER_NUM = new Map();
  STATE.MAP_FILTER_OP = new Map();
  STATE.MAP_NUMBERS = new Map<number, number>();
  STATE.MAP_OPERATOR = new Map<number, string>();
  STATE.MAP_VALUES_HANDLE = new Map();
  STATE.markerOperator = 0;
  STATE.reqToCalculate = false;
  STATE.result = 0;
  STATE.resultCache = 0;
  STATE.strPrevCopy = "";
  outputDisplay.innerText = "0";
  inputHistory.innerText = "";
}

btnAllClear.addEventListener("click", () => {
  eraseAllData();
});

window.addEventListener("keydown", (event: KeyboardEvent) => {
  const currNumOp = mainHubNumOp(event); // MAIN ENTRYPOINT
  if (!currNumOp) throw new Error("Cannot find mainHubNumOp() result");
  updateDisplay(currNumOp); // DOM UI CLIENT STUFF
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    calculateWhenCalled();
  }
});
