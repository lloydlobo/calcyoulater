import "./style.css";
import { drawData as drawD3Data } from "./charts/drawData";
import { drawLineOnCanvas, fillBlankOnCanvas } from "./canvas/canvas";
import { isOperator } from "./utils/isOperator";
import { compute } from "./logic/compute";
import { displayResult } from "./ui/displayResult";
import { displayHistory } from "./ui/displayHistory";
import { isNumAndOperator } from "./functions/isNumAndOperator";
import { updateDisplay } from "./ui/updateDisplay";
import { handleAllBtn } from "./functions/handleAllBtn";
import { filterBtnInputs } from "./functions/filterBtnInputs";
import { handleHubMapFilterState } from "./functions/handleHubMapFilterState";

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
const animateCanvas = (
  drawTime: number | undefined,
  blankTime: number | undefined
) => {
  setInterval(drawLineOnCanvas, drawTime);
  setInterval(fillBlankOnCanvas, blankTime);
};

// ////////////////DRAW CANVAS//////////
const drawCanvas = () => animateCanvas(1000, 1000);

// ////////////////LOGIC///////////////
export const STATE = {
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

export const REGEX = {
  regexIsNumber: /([0-9])/gm,
  regexIsOperator: /(-|÷|\+|\*)/gm,
  regexIsOperatorPositiveLookbehind: /.(?<=(-|÷|\*|\+))/, // gets all the operators groups
};

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

// Calculate result when "=" is entered/clicked
function calculateBtnListener() {
  btnCalculate.addEventListener("click", () => {
    STATE.countCompute += 1; // #6 RESET STATE so prev mappedData is reset & mainHubNumOp state setting of MAP_DATA is reset
    const result = compute();
    if (!result) throw new Error("result not found");
    STATE.resultCache = result; // #8 Increment DATA compute counter - fetch the prev val from array then
    displayResult();
    displayHistory();
  });
}

function main() {
  drawD3Data(); // D3 DATA RENDERING !!!!
  drawCanvas();

  addEventListenersToBtn();

  calculateBtnListener();
}

main();

// //// END OF SCRIPT ////
