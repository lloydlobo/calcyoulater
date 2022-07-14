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
export const outputDisplay = document.querySelector( "#output") as HTMLOutputElement; // prettier-ignore
const btnAll = document.getElementsByTagName("button") as any;
const btnClear = document.getElementById("btnClear") as HTMLButtonElement;
const btnAllClear = document.getElementById("btnAllClear") as HTMLButtonElement;

const btnClearArray = [btnClear, btnAllClear];
const btnDecimal = document.getElementById("btnDecimal") as HTMLButtonElement;

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

// ///////////////////////SETUP//////////////////////////////////////////////

let inputCount = 0;
let operatorCount = 0;

let valString = "";
// START OF GLOBAL VARIABLES
let x: number | null = null;
let y: number | null = null;
let operator: string | null = null;
let data = 0;
let inputArray: string[] = [];

function equalsIsClicked(val: string) {
  if (val !== "=") return false;
  return true;
}

function resetValues(a: number | null, b: number | null, z: string | null) {
  a = null;
  b = null;
  z = null;
  x = a;
  y = b;
  operator = z;
  return [x, y, operator];
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

allBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    const val = btn.value;
    if (!equalsIsClicked(val)) {
      valString = valString.concat(val);
      console.log(valString);
    }
    console.log({ inputArray });
    if (operatorIsClicked(val)) {
      operatorCount += 1; // switch off x_concat as it now takes result
      console.log({ operatorCount });
      operator = val;
      displayPersist(operator);
      cacheDigitsArray.push(operator); // FIXME maybe make it a json object with titles
    }
    if (val === "=") return;
    data = parseFloat(val);

    // TODO When AC or C is pressed rest inputCount to
    if (inputCount > 0) {
      x = parseFloat(valString.trim());
      // displayPersist(valString);
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
      console.log({ x_concat: x });
      displayPersist(val);
    }

    if (operatorCount > 0 && !operatorIsClicked(val)) {
      if (!y || y.toString().length < 1) {
        y = parseFloat(val);
        displayPersist(val);
      } else if (y.toString().length >= 1) {
        y = parseFloat(y.toString().concat(val));
        displayPersist(val);
      }
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
  return result;
}

function operate() {
  console.log({ inputArray });
  inputArray.push(valString);

  if (!x || !y || !operator) throw new Error("Invalid data");
  let result = operateSwitch(x, y, operator);
  if (!result) result = 0;
  valString = result.toString(); // reset valString - so first item is result
  console.log({ valString });
  if (!outputDisplay.textContent)
    throw new Error("Output display is undefined");
  cacheResultsArray.push(outputDisplay.textContent);
  // outputDisplay.textContent = result.toLocaleString();

  resetValues(x, y, operator);
  inputHistory.textContent = `Ans = ${valString}`; // FIXME
  outputDisplay.textContent = valString;
  toggle = false;
  clickDecimalOnce();

  inputCount += 1; // prepare all inputs to be pushed in next array step
  return { x, y, operator, inputCount };
}

// Calculate result when "=" is entered/clicked
btnCalculate.addEventListener("click", operate);

// ////////////////END/////////////////////////////////////////

btnClearArray.forEach((btn) => {
  btn.addEventListener("click", async () => {
    console.log(btn, "clear");
    outputDisplay.textContent = "0";
    inputCount = 0;
    operatorCount = 0;
    valString = "";
    inputArray = [];
    data = 0;
    resetValues(x, y, operator);
  });
});
