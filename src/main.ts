/* eslint-disable import/no-mutable-exports */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-console */
import "./style.css";

// import { scaleBand, scaleLinear } from "d3-scale";
import { drawLineOnCanvas, fillBlankOnCanvas } from "./canvas/canvas";
import { calculate, operatorArith } from "./logic/calculator";
import { dataFetch, drawChart } from "./drawChart";
// import { renderTree } from "./charts/tree";
// import * as flare from "./charts/flare.json";
// ////////////////END/////////////////////////////////////////

// https://stackoverflow.com/questions/42628635/element-insertadjacenthtml-api-throws-error-in-chrome-55-0-2883-87

// /////////////////////////APP//////////////////////////////////////////////

const app = document.querySelector<HTMLDivElement>("#app")!;
const appClass = app.className;
appClass.toLowerCase();

// ///////////////////////LOGIC//////////////////////////////////////////////

let x = null;
let y = null;
let operator = null;

x = 3;
y = 2;
operator = "-";

const resultCalculated = calculate(x, y, operator); // works!
console.log("file: main.ts | line 18 | resultCalculated", resultCalculated);

// ///////////////////////CHARTS D3//////////////////////////////////////////

const d3Article = document.getElementById("d3");
const d3Label = document.getElementById("d3Label") as HTMLLabelElement;
if (!d3Article) throw new Error("d3 not found");

export const d3Array: any[] = [];

(async () => {
  // use this to wait till the data is fetched
  await dataFetch;
  // and then draw d3 chart when d3Array is populated in the stack/heap?
  // FIXME
  await drawChart(d3Array); // uses a global variable
  if (!d3Label) throw new Error("d3 not found");
  d3Label.textContent = "Market Cap";
})();

// ////////////////CONSTANTS///////////////////////////////////
export const outputDisplay = document.querySelector(
  "#output"
) as HTMLOutputElement;
const btnAll = document.getElementsByTagName("button") as any;
export const inputHistory = document.querySelector("#inputHistory") as any;
inputHistory.textContent = "Input History FIXME"; // FIXME

// MUTABLE VARIABLES
const allBtn: HTMLButtonElement[] = [];
// const dataValidArray: number[] = [];
// let inputArray: string[] = [];
// let inputRegexArray: string[] = [];
// let validNum: string;
// let validOperator: string;

// Spread btnAll to access forEach method
const allButtons = [...btnAll];
allButtons.forEach((btn) => {
  allBtn.push(btn);
});

console.dir(allBtn);

function btnIsOperator(btnValue: string) {
  const val = btnValue;
  console.log(val);
  const isOperator = operatorArith.filter((item) => item.operator === val);
  if (isOperator.length === 0) {
    return null;
  }
  return isOperator[0].operator;
}

let count = 3;
allBtn.forEach((btn) => {
  btn.addEventListener("click", async () => {
    const { value } = btn;

    const filterVal = (() => {
      const filter = btnIsOperator(value);
      return filter;
      // console.log(filterVal);
    })();

    if (value === filterVal) {
      console.log("match");
    }
    if (value === "=") {
      // if (value === operatorArith.includes(operator)) {
      //   console.log(value, count);
      // }
      console.log(value, count);
    }
    count -= 1;
  });
});

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
  // renderD3Chart();
}

main();
