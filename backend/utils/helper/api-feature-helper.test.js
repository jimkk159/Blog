import { Op } from "sequelize";
import * as apiFeatureHelper from "./api-feature-helper.js";

vi.mock("sequelize");

describe("isOnlyOperator()", () => {
  test.each([null, [], undefined, NaN, "Test", 1])(
    "should throw error if input is not obj",
    (input) => {
      expect(() => apiFeatureHelper.isOnlyOperator(input)).toThrowError(
        "Input object must be an object"
      );
    }
  );

  test("should return true if obj has only one key", () => {
    const obj = { a: 1 };

    const result = apiFeatureHelper.isOnlyOperator(obj);

    expect(result).toBe(true);
  });

  test("should return false if obj has more than one key", () => {
    const obj = { a: 1, b: 2, c: 3 };

    const result = apiFeatureHelper.isOnlyOperator(obj);

    expect(result).toBe(false);
  });
});

describe("isOperatorInTable()", () => {
  test.each([null, undefined, NaN, "Test", 1])(
    "should throw error if input is not obj",
    (table) => {
      const testObj = {};
      expect(() =>
        apiFeatureHelper.isOperatorInTable(testObj, table)
      ).toThrowError("Input table must be an array");
    }
  );

  test("should return true if first key is in table", () => {
    const obj = { a: 1 };
    const table = ["a", "b", "c"];

    const result = apiFeatureHelper.isOperatorInTable(obj, table);

    expect(result).toBe(true);
  });

  test("should return false if first key is in table", () => {
    const obj = { a: 1 };
    const table = ["b", "c"];

    const result = apiFeatureHelper.isOperatorInTable(obj, table);

    expect(result).toBe(false);
  });
});

describe("getOperator()", () => {
  test("should get the first element of obj", () => {
    const obj = { a: 1, b: 2, c: 3 };

    const result = apiFeatureHelper.getOperator(obj);

    expect(result).toBe("a");
  });
});

describe("sanitizeFilterObj()", () => {
  const table = ["keyA", "keyB", "keyC"];

  test("should retrun empty obj if the value in an obj is not also an obj", () => {
    const obj = { id: 1 };

    const result = apiFeatureHelper.sanitizeFilterObj(obj, table);

    expect(result).toEqual({});
  });

  test("should retrun empty obj if the value in an obj is not the only obj", () => {
    const obj = { id: { keyA: 3, keyB: 5 } };

    const result = apiFeatureHelper.sanitizeFilterObj(obj, table);

    expect(result).toEqual({});
  });

  test("should retrun empty obj if the value in an obj is not in the table", () => {
    const obj = { id: { keyD: 3 } };

    const result = apiFeatureHelper.sanitizeFilterObj(obj, table);

    expect(result).toEqual({});
  });

  test("should retrun the right key-value pair if obj is provided", () => {
    const obj = {
      id: { keyA: 3 },
      cash: 100,
      product: { keyA: 3, keyB: 5 },
      age: { keyD: 1 },
    };

    const result = apiFeatureHelper.sanitizeFilterObj(obj, table);

    expect(result).toEqual({ id: { keyA: 3 } });
  });
});

describe("getFilterShouldIn()", () => {
  test.each([{ A: [] }, { B: [1, 2] }, { C: ["A", "B"] }])(
    "should retrun obj with key with an array ",
    (obj) => {
      const result = apiFeatureHelper.getQueryItemShouldIn(obj);

      expect(result).toEqual(obj);
    }
  );

  test.each([
    { A: 1 },
    { B: "Test" },
    { C: null },
    { D: NaN },
    { E: undefined },
    { F: {} },
  ])("should retrun empty obj if query value is not array", (obj) => {
    const result = apiFeatureHelper.getQueryItemShouldIn(obj);

    expect(result).toEqual({});
  });

  test("should retrun obj with only the key has an array ", () => {
    const obj = { A: [1, 2], B: {}, C: "Test" };
    const result = apiFeatureHelper.getQueryItemShouldIn(obj);

    expect(result).toEqual({ A: [1, 2] });
  });
});

describe("getQueryItemEqualTo()", () => {
  test.each([{ A: "1" }, { B: "A" }])(
    "should retrun obj with key with string ",
    (obj) => {
      const result = apiFeatureHelper.getQueryItemEqualTo(obj);

      expect(result).toEqual(obj);
    }
  );

  test.each([
    { A: 1 },
    { B: [] },
    { C: null },
    { D: NaN },
    { E: undefined },
    { F: {} },
  ])("should retrun empty obj if query value is not string", (obj) => {
    const result = apiFeatureHelper.getQueryItemEqualTo(obj);

    expect(result).toEqual({});
  });

  test("should retrun obj with only the key has string ", () => {
    const obj = { A: "Test", B: {}, C: [1, 2] };
    const result = apiFeatureHelper.getQueryItemEqualTo(obj);

    expect(result).toEqual({ A: "Test" });
  });
});

describe("getQueryElements()", () => {
  test("should split string to elements", () => {
    const string = "a,b,c";

    const result = apiFeatureHelper.getQueryElements(string);

    expect(result).toEqual(["a", "b", "c"]);
  });
});

describe("replaceOperator()", () => {
  const testKey = "testKey";
  const testVaue = "testValue";
  const wrongTestKey = "wrongTestValue";
  const replacedTestKey = "OpTestKey";

  test("should replace an operator if input obj has an operator", () => {
    const testObj = { [testKey]: testVaue };
    Op = { [testKey]: replacedTestKey };

    const result = apiFeatureHelper.replaceOperator(testKey, testObj);

    expect(result).toEqual({
      [Op[testKey]]: testObj[testKey],
    });
  });

  test("should not create an operator if input obj doesn't have an operator", () => {
    const testObj = { [testKey]: testVaue };
    Op = { [wrongTestKey]: replacedTestKey };

    const result = apiFeatureHelper.replaceOperator(testKey, testObj);

    expect(result).not.toEqual({
      [Op[wrongTestKey]]: testObj[testKey],
    });
  });
});

describe("replaceFilterOperators()", () => {
  test("should replace an operator if queryObj is provided", () => {
    const obj = {
      id: { keyA: 1 },
      age: { keyB: 3, keyC: 5 },
    };
    Op = { keyA: "testKeyA", keyB: "testKeyB" };

    const result = apiFeatureHelper.replaceFilterOperators(obj);

    expect(result).toEqual({
      id: { testKeyA: 1 },
      age: { testKeyB: 3 },
    });
  });
});

describe("createSequelizeSort()", () => {
  test("should return Sequelize sort syntax array ", () => {
    const sortArray = ["id", "name", "-age"];

    const result = apiFeatureHelper.createSequelizeSort(sortArray);

    expect(result).toEqual([
      ["id", "ASC"],
      ["name", "ASC"],
      ["age", "DESC"],
    ]);
  });
});

describe("createSequelizeAttributes()", () => {
  test("should return the attributes if postive keys are in fields ", () => {
    const fields = ["id", "-age", "name"];

    const result = apiFeatureHelper.createSequelizeAttributes(fields);

    expect(result).toEqual(["id", "name"]);
  });

  test("should return an empty array if not any postive key is in fields ", () => {
    const fields = ["-age", "-product"];

    const result = apiFeatureHelper.createSequelizeAttributes(fields);

    expect(result).toEqual([]);
  });
});

describe("createSequelizeExclude()", () => {
  test("should return the excluds if negative key is in fields ", () => {
    const fields = ["id", "name", "-age"];

    const result = apiFeatureHelper.createSequelizeExclude(fields);

    expect(result).toEqual(["age"]);
  });

  test("should return an empty array if not any negative key is in fields ", () => {
    const fields = ["id", "name"];

    const result = apiFeatureHelper.createSequelizeExclude(fields);

    expect(result).toEqual([]);
  });
});
