import * as tagHelper from "./tag-helper";
import * as errorTable from "../error/error-table";

describe("isTagIdLegal()", () => {
  test("should retrun true if number type of number is provided", () => {
    expect(tagHelper.isTagIdLegal(1)).toBe(true);
  });

  test("should retrun true if string type of number is provided", () => {
    expect(tagHelper.isTagIdLegal("1")).toBe(true);
  });

  test("should retrun true if array is provided", () => {
    expect(tagHelper.isTagIdLegal([])).toBe(true);
  });

  test.each(["test", {}, null, undefined, NaN])(
    "should retrun false if wrong type is provided",
    (input) => {
      expect(tagHelper.isTagIdLegal(input)).toBe(false);
    }
  );
});

describe("checkTagsConsistency()", () => {
  test.each([1, "1"])(
    "should throw error if tagIds is number and tags is empty array",
    (tagIds) => {
      let error;
      const tags = [];

      try {
        tagHelper.checkTagsConsistency(tags, tagIds);
      } catch (err) {
        error = err;
      }

      expect(error).toEqual(errorTable.tagNotExistError());
    }
  );

  test("should throw error if of tagIds and tags lengths do not match", () => {
    let error;
    const tags = [];
    const tagIds = ["1", "2"];
    try {
      tagHelper.checkTagsConsistency(tags, tagIds);
    } catch (err) {
      error = err;
    }

    expect(error).toEqual(errorTable.tagNotExistError());
  });
});
