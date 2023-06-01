import * as helper from "../../utils/helper/helper";
import * as upload from "../../utils/aws/s3.js";
import { afterAll, beforeAll, beforeEach } from "vitest";

vi.mock("../aws/s3.js");
describe("isURL()", () => {
  test("should return false if input is null", () => {
    expect(helper.isURL()).toBe(false);
  });

  test("should return false if input is not url", () => {
    expect(helper.isURL("test")).toBe(false);
  });

  test("should return true if input start with htt://", () => {
    expect(helper.isURL("http://")).toBe(true);
  });

  test("should return true if input start with htts://", () => {
    expect(helper.isURL("https://")).toBe(true);
  });
});

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

describe("keepKeys()", () => {
  test("should keep keys from the obj if keys want to remain", () => {
    const inputObj = { a: "A", b: "B", c: "C" };

    expect(helper.keepKeys(inputObj, ["a", "b", "c"])).toEqual(inputObj);
  });

  test("should remove keys from the obj if keys do not want to remain", () => {
    const inputObj = { a: "A", b: "B", c: "C" };

    expect(helper.keepKeys(inputObj, [])).toEqual({});
  });
});

describe("removeKeys()", () => {
  test("should remove the key in exclude array true", () => {
    const obj = { name: "Tom", password: 123456 };
    const exlcude = ["password"];
    expect(helper.removeKeys(obj, exlcude)).toEqual({ name: "Tom" });
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

describe("isNumber()", () => {
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

describe("deepClone()", () => {
  test("should deep clone the obj", () => {
    const inputObj = { lv1: { lv2: { lv3: "test" } } };

    const result = helper.deepClone(inputObj);

    expect(result.lv1.lv2).not.toBe(inputObj.lv1.lv2);
  });
});

describe("commandToS3Avatar()", () => {
  test("should return origin file if the file is null", async () => {
    let inputFile;
    const command = vi.fn();

    const result = await helper.commandToS3Avatar(inputFile, command);

    expect(command).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  test("should return origin file if the file is url", async () => {
    const inputFile = "http://";
    const command = vi.fn();

    const result = await helper.commandToS3Avatar(inputFile, command);

    expect(command).not.toHaveBeenCalled();
    expect(result).toBe(inputFile);
  });

  test("should run the command by file if the file is not url", async () => {
    const inputFile = "test";
    const command = vi.fn();

    const result = await helper.commandToS3Avatar(inputFile, command);

    expect(command).toHaveBeenLastCalledWith(inputFile);
  });
});

describe("deleteAvatarUrlFromS3()", () => {
  test("should delete the avatar by file and delete function", async () => {
    const inputFile = "test";
    vi.spyOn(helper, "commandToS3Avatar").mockImplementationOnce(
      async () => {}
    );

    await helper.deleteAvatarUrlFromS3(inputFile);

    expect(helper.commandToS3Avatar).toHaveBeenLastCalledWith(
      inputFile,
      upload.deleteFileFromS3
    );
  });
});

describe("getAvatarsUrlFromS3()", () => {
  beforeAll(() => {
    vi.spyOn(helper, "getImgUrlFromS3").mockImplementation(
      (el) => "testAvatarFromS3" + el
    );
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should get avatars", async () => {
    let error;
    const avatars = [{ avatar: "avatar1" }, { avatar: "avatar2" }];

    const result = await helper
      .getAvatarsUrlFromS3(avatars)
      .catch((err) => (error = err));

    expect(avatars).toEqual([
      { avatar: "testAvatarFromS3" + "avatar1" },
      { avatar: "testAvatarFromS3" + "avatar2" },
    ]);
  });
});

describe("deleteImgUrlFromS3()", () => {
  test("should delete the img by file", async () => {
    const inputFile = "test";
    vi.spyOn(upload, "deleteFileFromS3").mockImplementationOnce(async () => {});

    await helper.deleteImgUrlFromS3(inputFile);

    expect(upload.deleteFileFromS3).toHaveBeenLastCalledWith(inputFile);
  });
});

describe("getImgUrlFromS3()", () => {
  test("should get the img by file", async () => {
    const inputFile = "test";

    expect(helper.getImgUrlFromS3(inputFile)).toBe(
      "https://jimkk159-blog-img.s3.ap-northeast-1.amazonaws.com/" + inputFile
    );
  });
});
