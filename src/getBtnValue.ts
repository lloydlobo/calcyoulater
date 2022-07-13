import { outputDisplay, inputHistory } from "./main";

function getBtnValue(value: any) {
  let counterNum = 0; // for no. of clicks and keystrokes
  let counterNaN = 0;
  console.log(counterNum, counterNaN);
  let dataValid;
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
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
}
function clearCurrent() {
  inputArray = [];
  inputRegexArray = [];
  inputHistory = [];
}
