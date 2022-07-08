import { drawLineOnCanvas, fillBlankOnCanvas } from "./canvas/canvas";
import "./style.css";

// /////////////////////////APP//////////////////////////////////////////////
const app = document.querySelector<HTMLDivElement>("#app")!;
// app.innerHTML = ` //   <h1>Hello Vite!</h1> //   <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a> // `;

console.log(app);
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

allBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    console.log(btn.value);
  });
});

//
//
//
//
//
//

// GET TEXT
const outputVal = outputDisplay.textContent;

export let output: number;
if (outputVal) {
  output = parseInt(outputVal, 10);
  console.log(output);
}

// //////////////////////////CANVAS//////////////////////////////////////////

setInterval(drawLineOnCanvas, 1000);
setInterval(fillBlankOnCanvas, 1000);

// //////////////////////////////////////////////////////////////////////////
