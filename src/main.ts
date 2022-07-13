/* eslint-disable no-param-reassign */ /* eslint-disable import/no-mutable-exports */ /* eslint-disable import/no-unresolved */ /* eslint-disable import/extensions */ /* eslint-disable no-console */
import "./style.css";
import { drawLineOnCanvas, fillBlankOnCanvas } from "./canvas/canvas";
import { calculate, operatorArith } from "./logic/calculator";
import { drawData } from "./charts/drawData";

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
export const inputHistory = document.querySelector("#inputHistory") as any;
inputHistory.textContent = "Input History FIXME"; // FIXME

// MUTABLE VARIABLES
const allBtn: HTMLButtonElement[] = [];

// Spread btnAll to access forEach method
const allButtons = [...btnAll];

allButtons.forEach((btn) => {
  allBtn.push(btn);
});
console.log(operatorArith);

// disableNumbers();
// disableOperators();
// disableEquals();
// disableAll();
// disableMemory();
// disableClear();
// disablePlusMinus();
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

// ////////////////MAIN////////////////////////////////////////

// MAIN
function main() {
  animateCanvas(1000, 1000);
}

main();

// ///////////////////////LOGIC//////////////////////////////////////////////

let x = null;
let y = null;
let operator = null;

x = 5;
y = 2;

operator = "-";

x = 7;
y = 6;

operator = "*";
const resultCalculated = calculate(x, y, operator); // works!
if (!resultCalculated) throw new Error("resultCalculated error");

outputDisplay.textContent = resultCalculated[0].toLocaleString();

console.log("file: main.ts | line 18 | resultCalculated", resultCalculated);

// ////////////////END/////////////////////////////////////////
