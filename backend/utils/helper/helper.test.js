import * as helper from "./helper";

describe("toNaturalNumber()", () => {
  test.each(["1", "2"])(
    "should return natural number if string type of natural number is provided",
    (input) => {
      const result = helper.toNaturalNumber(input);
      expect(result).toBe(+input);
    }
  );

  test.each([1, 2])(
    "should return natural number if number type of natural number is provided",
    (input) => {
      const result = helper.toNaturalNumber(input);
      expect(result).toBe(+input);
    }
  );

  test.each([1.2, "1.6"])(
    "should return drop the number before the decimal point if number is float",
    (input) => {
      const result = helper.toNaturalNumber(input);
      expect(result).toBe(1);
    }
  );

  test.each([-1, -1.1, "-1", "-1.1"])(
    "should return 0 if number is less than 0",
    (input) => {
      const result = helper.toNaturalNumber(input);
      expect(result).toBe(0);
    }
  );

  test.each([null, undefined, NaN, [], {}])(
    "should return 0 if non number is provided",
    (input) => {
      const result = helper.toNaturalNumber(input);
      expect(result).toBe(0);
    }
  );
});

describe("isObject()", () => {
  test("should return true if obj is provided", () => {
    expect(helper.isObject({ test: "Test" })).toBe(true);
  });

  test.each([null, [], undefined, NaN, "Test", 1])(
    "should return false if non-obj is provided",
    (input) => {
      expect(helper.isObject(input)).toBe(false);
    }
  );
});

describe("isIncludeID()", () => {
  test.each([{ id: "Test" }, { ID: "Test" }])(
    "should return true if obj is include id",
    (obj) => {
      expect(helper.isIncludeID(obj)).toBe(true);
    }
  );

  test.each([{ test: "Test" }, { 1: "Test" }])(
    "should return false if obj is not include id",
    (obj) => {
      expect(helper.isIncludeID(obj)).toBe(false);
    }
  );
});

describe("removeExclude()", () => {
  test("should remove the key in exclude array true", () => {
    const obj = { name: "Tom", password: 123456 };
    const exlcude = ["password"];
    expect(helper.removeExclude(obj, exlcude)).toEqual({ name: "Tom" });
  });
});

describe("isExpired()", () => {
  test("should return true if expired_in is not provided.", () => {
    expect(helper.isExpired(null)).toBe(true);
  });

  test("should return true if it is expired.", () => {
    expect(helper.isExpired(new Date("2000-01-01"))).toBe(true);
  });

  test("should return false if it is not expired.", () => {
    expect(helper.isExpired(new Date("5000-01-01"))).toBe(false);
  });
});

describe("isNumber", () => {
  test.each([1, 1.1])(
    "should return true if number type of number is provided",
    (input) => {
      expect(helper.isNumber(input)).toBe(true);
    }
  );

  test.each(["1", "1.1"])(
    "should return true if string type of number is provided",
    (input) => {
      expect(helper.isNumber(input)).toBe(true);
    }
  );

  test("should return false if non-number string is provided", () => {
    expect(helper.isNumber("test")).toBe(false);
  });

  test("should return false if null is provided", (input) => {
    expect(helper.isNumber(null)).toBe(false);
  });

  test("should return false if undefined is provided", () => {
    expect(helper.isNumber(undefined)).toBe(false);
  });

  test("should return false if NaN is provided", () => {
    expect(helper.isNumber(NaN)).toBe(false);
  });

  test("should return false if array is provided", () => {
    expect(helper.isNumber([])).toBe(false);
  });

  test("should return false if obj is provided", () => {
    expect(helper.isNumber({})).toBe(false);
  });
});
