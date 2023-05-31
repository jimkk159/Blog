import { add } from "../math";

test("should add the input number", () => {
  expect(add(1, 2)).toBe(3);
});