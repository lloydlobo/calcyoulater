/* eslint-disable no-undef */
/* eslint-disable import/extensions */
// eslint-disable-next-line import/no-unresolved
import { calculate } from "../src/logic/calculator";

describe("calculate(x, y, 'operator')", () => {
  it("should calculate", () => {
    const result = calculate(2, 3, "+");
    expect(result![0] as number).toEqual(5);
  });
});
