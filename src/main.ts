/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-console */
import "./style.css";

import * as d3 from "d3";
// import { scaleBand, scaleLinear } from "d3-scale";
import { drawLineOnCanvas, fillBlankOnCanvas } from "./canvas/canvas";
import { calculate } from "./logic/calculator";
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
let operator = "+";

x = 3;
y = 2;
operator = "-";

const resultCalculated = calculate(x, y, operator); // works!
console.log("file: main.ts | line 18 | resultCalculated", resultCalculated);

// ///////////////////////CHARTS D3//////////////////////////////////////////

const d3Article = document.getElementById("d3");
const d3Label = document.getElementById("d3Label") as HTMLLabelElement;
if (!d3Article) throw new Error("d3 not found");

const d3Array: any[] = [];

async function drawChart(DUMMY_DATA: any[]) {
  console.log(await DUMMY_DATA[9]);
  if (!DUMMY_DATA) throw new Error("d3 not found");
  // https://youtu.be/TOJ9yjvlapY
  const xScale = d3
    .scaleBand()
    .domain(DUMMY_DATA.map((dataPoint) => dataPoint.coin))
    .rangeRound([0, 250])
    .padding(0.1);
  const yScale = d3.scaleLinear().domain([0, 1000]).range([200, 0]);

  const d3Container = d3.select("#d3").classed("container-d3", true);

  const d3Bars = d3Container
    .selectAll(".bar")
    .data(DUMMY_DATA)
    .enter()
    .append("rect")
    .classed("bar", true)
    .attr("width", xScale.bandwidth())
    .attr("height", (data) => 200 - yScale(data.value))
    .attr("x", (data) => xScale(data.coin) as number)
    .attr("y", (data) => yScale(data.value));
  console.log(d3Bars);
  // setTimeout(() => {
  //   d3Bars.data(DUMMY_DATA.slice(0, 2)).exit().remove(); // exit opposite of enter & remove from DOM
  // }, 2000);
}

// ///////////////////////FETCH FEED FROM API////////////////////////////////

const feedDisplay = document.querySelector("#feed") as HTMLDivElement;
const url = "https://crytpoku.herokuapp.com/crypto";
// Add CORS Package in your backend server directory
const dataFetch = fetch(url)
  .then((response) => response.json())
  .then((data) => {
    data.result.forEach((entry: any, index: number) => {
      // console.log(entry);
      if (index < 10) {
        const articleItem = `
      <div>
      <h3 id="coinTitle" class="title">
              <a href="https://www.google.com/search?q=${entry.Coin}">
              ${entry.Coin}
                </a>
                </h3>
                <div class="price">
                <button id="btnFetchPrice" class="m-0 px-2 py-1">${entry.Price}</button>
                </div>
                <div class="market-cap">
                <button id="btnFetchMarketCap" class="m-0 px-2 py-1">
                ${entry.Marketcap}
                </button>
                </div>
                <div class="day-7">
                <button id="btnFetch7Days" class="m-0 px-2 py-1">
                ${entry.Days_7}
                </button>
                </div>
                <div class="hours-7">
                <button id="btnFetch24Hours" class="m-0 px-2 py-1">
                ${entry.Hours_24}
                </button>
                </div>
                </div>
                `;
        feedDisplay.insertAdjacentHTML("beforeend", articleItem);

        (async () =>
          d3Array.push({
            id: (index + 1).toString(),
            price:
              parseFloat((await entry.Price).substring(1).replace(/,/, "")) *
              0.01, // remove $ char, and replace , with empty string
            value: parseFloat(entry.Marketcap) * 100,
            coin: await entry.Coin,
          }))();
      }
    });
  })
  .catch((err) => console.error(err));

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
const outputDisplay = document.querySelector("#output") as HTMLOutputElement;
const btnAll = document.getElementsByTagName("button") as any;
const inputHistory = document.querySelector("#inputHistory") as any;

// MUTABLE VARIABLES
const allBtn: HTMLButtonElement[] = [];
const dataValidArray: number[] = [];
let inputArray: string[] = [];
let inputRegexArray: string[] = [];
let validNum: string;
let validOperator: string;

// Spread btnAll to access forEach method
const allButtons = [...btnAll];
allButtons.forEach((btn) => {
  allBtn.push(btn);
});

// console.dir(allBtn);

function getBtnValue(value: any) {
  let counterNum = 0; // for no. of clicks and keystrokes
  let counterNaN = 0;

  console.log(counterNum, counterNaN);
  let dataValid;

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
  /* // Before regular expressions can be used, they have to be compiled. This process allows them to perform matches more efficiently.  let re = /ab+c/i; // literal notation let re = new RegExp('ab+c', 'i') // constructor with string pattern as first argument let re = new RegExp(/ab+c/, 'i') // constructor with regular expression literal as first argument (Starting with ECMAScript 6) */

  const regExpNumAndOperator = /[+-]?(\d*\.\d+|\d+\.\d*|\d+)/gm; // gm -> global & multiline
  const regExpNumOnly = /[0-8]/gm;
  if (value) {
    if (typeof value === "string") {
      inputArray.push(value);
      const inputJoin = inputArray.join("");
      inputRegexArray.push(value);

      if (value.match(regExpNumOnly)) {
        console.log("num only", value);
        validNum = inputRegexArray.join("").replace(regExpNumAndOperator, `$1`);
      } else {
        validOperator = inputRegexArray
          .join(" ")
          .replace(regExpNumAndOperator, `$1`); // FIXME filter out only operators
      }

      console.log({ validNum }, { validOperator }); // {validNum: '15933'}validNum: "15933"[[Prototype]]: Object {validOperator: '1 + 5 - 9 +'}

      outputDisplay.textContent = inputJoin;
      if (value === "=") {
        inputHistory.textContent = inputJoin.split("").join(" ");
      }
      const data = parseInt(value, 10);
      dataValid = data;
      dataValidArray.push(dataValid);

      counterNum += 1;
      return dataValidArray;
    }
    if ((value as any).isNaN) {
      outputDisplay.innerHTML = "NaN";
      counterNaN += 1;
      return NaN;
    }
  }
  return dataValidArray;
  // throw new Error("Function not implemented.");
}

function clearDisplay() {
  outputDisplay.innerHTML = "0";
}

function clearMemory() {
  const inputHistoryMCArray: any[] = [];
  console.log(inputHistoryMCArray);
}

function clearCurrent() {
  inputArray = [];
  inputRegexArray = [];
  // inputHistory = []
  // throw new Error("Function not implemented.");
}

allBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    const { value } = btn;

    const validDataNumbers = getBtnValue(value);

    console.log(validDataNumbers);

    if (btn.value === "=") {
      outputDisplay.textContent = (5 + 5).toString();
    }

    if (btn.value === "C" || btn.value === "AC") {
      clearDisplay();
      clearCurrent();
    }

    if (btn.value === "MC") {
      clearMemory();
    }
  });
});

// ////////////////CANVAS//////////////////////////////////////

// GET TEXT From User Input in DOM Display
const outputVal = outputDisplay.textContent;

// eslint-disable-next-line import/prefer-default-export, import/no-mutable-exports

// eslint-disable-next-line import/prefer-default-export, import/no-mutable-exports
export let output: number; // canvas animation

if (outputVal) {
  output = parseInt(outputVal, 10);
  // console.log(output);
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
