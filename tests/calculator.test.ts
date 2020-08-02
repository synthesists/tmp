import { sum } from "../src/calculator";

describe("calculator", () => {
  it("should calculate '1 + 1'", () => {
    expect(sum(1, 1)).toBe(2);
  });
});
