import { drawLineOnCanvas, fillBlankOnCanvas } from "./canvas/canvas";
import "./style.css";

// /////////////////////////APP//////////////////////////////////////////////
const app = document.querySelector<HTMLDivElement>("#app")!;
// app.innerHTML = ` //   <h1>Hello Vite!</h1> //   <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a> // `;

console.log(app);
const appClass = app.className;
appClass.toLowerCase();
// //////////////////////////////////////////////////////////////////////////

// CONSTANTS
const outputDisplay = document.querySelector("#output") as HTMLOutputElement;
const btnAll = document.getElementsByTagName("button") as any;

const allButtons = [...btnAll];

let allBtn: HTMLButtonElement[] = [];

allButtons.forEach((btn) => {
  allBtn.push(btn);
});

console.dir(allBtn);
let dataValidArray: number[] = [];
let inputArray: string[] = [];
let inputRegexArray: string[] = [];
let validNum: string;
let validOperator: string;
function getBtnValue(value: any) {
  let counterNum = 0; // for no. of clicks and keystrokes
  let counterNaN = 0;

  let dataValid;

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
  /* 
  // Before regular expressions can be used, they have to be compiled. This process allows them to perform matches more efficiently.
  let re = /ab+c/i; // literal notation
  let re = new RegExp('ab+c', 'i') // constructor with string pattern as first argument
  let re = new RegExp(/ab+c/, 'i') // constructor with regular expression literal as first argument (Starting with ECMAScript 6)*/

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

      const data = parseInt(value, 10);
      dataValid = data;
      dataValidArray.push(dataValid);

      counterNum += 1;
      return dataValidArray;
    } else if (isNaN(value)) {
      outputDisplay.innerHTML = "NaN";
      counterNaN += 1;
      return NaN;
    }
  }
  return dataValidArray;
  // throw new Error("Function not implemented.");
}

allBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    const value = btn.value;

    const validDataNumbers = getBtnValue(value);
    // console.log(validDataNumbers);
  });
});

//
//
//
//
//
//

// GET TEXT From User Input in DOM Display
const outputVal = outputDisplay.textContent;

export let output: number;
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

// MAIN
function main() {
  animateCanvas(1000, 1000);
}

main();
