// import chalk from "chalk";

let operatorArith = [
  { name: "division", operator: "/" },
  { name: "multiplication", operator: "*" },
  { name: "addition", operator: "+" },
  { name: "subtraction", operator: "-" },
];

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
  if (xOrYIsInvalid || isNaN(x) || isNaN(y) || operatorIsInvalid) {
    throw new Error("Invalid numbers or " + operatorInput + "");
  }

  const dividedByZero = y === 0 && operatorInput === "/";
  if (dividedByZero) {
    console.error(
      "Can't divide by zero or the universe may explode infinitely!"
    );
    throw new Error(
      "Can't divide by zero. The universe may explode infinitely!"
    );
  }
  return new Error(
    "Invalid numbers or " + operatorInput + " must be " + dividedByZero
  );
}

const result = calculate(2, 1, "/");

if (result) {
  console.log(result);
}
// calculate(2, 4, "+");

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
      console.error("Invalid operator");
      throw new Error("Somewhere went wrong!");
    }
  }
}

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
