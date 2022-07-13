/* eslint-disable no-param-reassign */ /* eslint-disable import/no-mutable-exports */ /* eslint-disable import/no-unresolved */ /* eslint-disable import/extensions */ /* eslint-disable no-console */
import "./style.css";
import { drawLineOnCanvas, fillBlankOnCanvas } from "./canvas/canvas";
import { drawData } from "./charts/drawData";
// import { operatorArith } from "./logic/calculator";

// /////////////////////////APP//////////////////////////////////////////////
const app = document.querySelector<HTMLDivElement>("#app")!;
const appClass = app.className;
appClass.toLowerCase();

// ///////////////////////CHARTS D3//////////////////////////////////////////
const d3Article = document.getElementById("d3");
export const d3Label = document.getElementById("d3Label") as HTMLLabelElement;
export const btnD3Category = document.getElementById(
  "btnD3Category"
) as HTMLButtonElement;
if (!d3Article) throw new Error("d3 not found");
export const d3Array: any[] = [];
// D3 DATA RENDERING !!!!
drawData();

// ////////////////CONSTANTS///////////////////////////////////
export const outputDisplay = document.querySelector(
  "#output"
) as HTMLOutputElement;
const btnAll = document.getElementsByTagName("button") as any;

const btnCalculate = document.getElementById(
  "btnResultEquals"
) as HTMLButtonElement;

export const inputHistory = document.querySelector("#inputHistory") as any;
const cacheResultsArray: string[] = [];
const cacheDigitsArray: (string | number)[] = [];

// MUTABLE VARIABLES
const allBtn: HTMLButtonElement[] = [];
// Spread btnAll to access forEach method
const allButtons = [...btnAll];
allButtons.forEach((btn) => {
  allBtn.push(btn);
});

// disableNumbers(); // disableOperators(); // disableEquals(); // disableAll(); // disableMemory(); // disableClear(); // disablePlusMinus();

// ////////////////CANVAS//////////////////////////////////////
// GET TEXT From User Input in DOM Display
const outputVal = outputDisplay.textContent;
export let output: number; // canvas animation
if (outputVal) {
  output = parseInt(outputVal, 10);
}
// Animate the canvas at intervals
const animateCanvas = (
  drawTime: number | undefined,
  blankTime: number | undefined
) => {
  setInterval(drawLineOnCanvas, drawTime);
  setInterval(fillBlankOnCanvas, blankTime);
};

// ////////////////DRAW CANVAS////////////////////////////////////////
function drawCanvas() {
  animateCanvas(1000, 1000);
}
drawCanvas();

// ////////////////DOM DISPLAY INPUT////////////////////////////////////////
function isAOperator(val: string) {
  return val === "-" || val === "+" || val === "*" || val === "/";
}

function displayPersist(val: string | number) {
  console.log({ val });
  if (isAOperator(val as string)) {
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

// ///////////////////////SETUP//////////////////////////////////////////////

// START OF GLOBAL VARIABLES
let x: number | null = null;
let y: number | null = null;
let operator: string | null = null;
let data = 0;
// END OF GLOBAL VARIABLES

function resetValues(a: number | null, b: number | null, z: string | null) {
  a = null;
  b = null;
  z = null;
  x = a;
  y = b;
  operator = z;
  return [x, y, operator];
}

allBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    const val = btn.value;
    if (isAOperator(val)) {
      operator = val;
      displayPersist(operator);
      cacheDigitsArray.push(operator); // FIXME maybe make it a json object with titles
    }
    if (val === "=") return;
    data = parseFloat(val);
    if (!x) {
      x = data;
      displayPersist(x);
      console.log({ x });
      cacheDigitsArray.push(x);
    } else {
      y = data;
      if (!y) return;
      displayPersist(y);
      console.log({ y });
      cacheDigitsArray.push(y);
    }
    console.log({ x, y, operator });
  });
});

if (data === undefined) throw new Error("Invalid data");

// ////////////////LOGIC/////////////////////////////////////////
function operateSwitch(
  l: number,
  m: number,
  operatorType: string
): number | null {
  let result = null;

  if (operatorType === "/") {
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
  return result;
}

function operate() {
  if (!x || !y || !operator) throw new Error("Invalid data");
  let result = operateSwitch(x, y, operator);
  if (!result) result = 0;

  outputDisplay.textContent = result.toLocaleString();
  inputHistory.textContent = outputDisplay.textContent; // FIXME

  cacheResultsArray.push(outputDisplay.textContent);

  resetValues(x, y, operator);
  outputDisplay.textContent = "0";

  return { x, y, operator };
}

// Calculate result when "=" is entered/clicked
btnCalculate.addEventListener("click", operate);

// ////////////////END/////////////////////////////////////////
