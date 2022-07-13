/* eslint-disable consistent-return */
/* eslint-disable import/prefer-default-export */

// ////////////////POSSIBLE OPERATOR OBJECT ////////////////////////

export const operatorArith = [
  { name: "division", operator: "/" },
  { name: "multiplication", operator: "*" },
  { name: "addition", operator: "+" },
  { name: "subtraction", operator: "-" },
];

// ///////////INPUT NUMBERS & OPERATORS VALIDITY CHECKER////////////

function isValid(
  operatorInput: string | null | undefined,
  x: number | null | undefined,
  y: number | null | undefined
) {
  const operatorIsInvalid =
    operatorInput === undefined || operatorInput === null;
  const xOrYisNull =
    x === null || x === undefined || y === null || y === undefined;
  const xOrYisInfinity = x === Infinity || y === Infinity;
  const xOrYIsInvalid = xOrYisNull || xOrYisInfinity;
  if (
    xOrYIsInvalid ||
    (x as any).isNaN ||
    (y as any).isNaN ||
    operatorIsInvalid
  ) {
    throw new Error(`Invalid numbers or ${operatorInput}`);
  }

  const dividedByZero = y === 0 && operatorInput === "/";
  if (dividedByZero) {
    throw new Error(
      "Can't divide by zero. The universe may explode infinitely!"
    );
  }
  return new Error(
    `Invalid numbers or ${operatorInput} must be ${dividedByZero}`
  );
}

// /////////////////////////GET CALCULATIONS/////////////////////////////////

function getCalculations(operatorUsed: string, x: number, y: number) {
  switch (operatorUsed) {
    case "/": {
      return [x / y, x, y, operatorUsed];
    }
    case "*": {
      return [x * y, x, y, operatorUsed];
    }
    case "+": {
      return [x + y, x, y, operatorUsed];
    }
    case "-": {
      return [x - y, x, y, operatorUsed];
    }
    default: {
      throw new Error("Somewhere went wrong!");
    }
  }
}
// /////////////////////////CALCULATE MAIN FN////////////////////////////////

export function calculate(
  x: number | null | undefined,
  y: number | null | undefined,
  operatorInput: string | null | undefined
):
  | (number | "/")[]
  | (number | "*")[]
  | (number | "+")[]
  | (number | "-")[]
  | undefined {
  const isError = isValid(operatorInput, x, y);
  if (!isError) return;

  const operatorUsed = operatorArith.filter(
    (o) => o.operator === operatorInput
  )[0].operator;

  return getCalculations(operatorUsed, x!, y!);
}

// /////////////////////////DEBUG////////////////////////////////////////////

// const result = calculate(2, 1, "/");
// if (result) { //   console.log(result); // }
// // calculate(2, 4, "+");

// /////////////////////////END//////////////////////////////////////////////

// https://www.programiz.com/javascript/operators
/* 
Bracket Order Division Multiplication Addition Subtraction
+	Addition	x + y
-	Subtraction	x - y
*	Multiplication	x * y
/	Division	x / y
%	Remainder	x % y
++	Increment (increments by 1)	++x or x++
--	Decrement (decrements by 1)	--x or x--
**	Exponentiation (Power)	x ** y
*/
