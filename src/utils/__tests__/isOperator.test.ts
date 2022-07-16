/* eslint-disable no-undef */
/* eslint-disable import/extensions */
// eslint-disable-next-line import/no-unresolved
import { isOperator } from "../isOperator";

describe("isOperator", () => {
  it("should return true when operators are + - * ÷", () => {
    const operators = ["÷", "*", "+", "-"];
    let result;
    for (let i = 0; i < operators.length; i += 1) {
      result = isOperator(operators[i].toString());
      expect(result).toBe(true);
    }

    expect(isOperator("-")).toBe(true);
    expect(isOperator("+")).toBe(true);
    expect(isOperator("*")).toBe(true);
    expect(isOperator("÷")).toBe(true);
  });
});
