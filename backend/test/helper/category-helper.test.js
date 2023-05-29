import { beforeAll, beforeEach } from "vitest";
import Category from "../../module/category";
import * as errorTable from "../../utils/error/error-table";
import * as categoryHelper from "../../utils/helper/category-helper";

describe("checkParentIsExist()", () => {
  beforeAll(() => {
    vi.spyOn(Category, "findByPk").mockImplementation(async () => {});
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should throw error if parent no exist", async () => {
    let error;
    await categoryHelper.checkParentIsExist().catch((err) => (error = err));

    expect(error).toEqual(errorTable.parentNotFound());
  });

  test("should not throw error if parent exist", async () => {
    let error;
    Category.findByPk.mockResolvedValueOnce(true);

    await categoryHelper.checkParentIsExist().catch((err) => (error = err));

    expect(error).toBeUndefined();
  });

  test("should has property if id provided", async () => {
    let error;
    const testID = "testID";

    await categoryHelper
      .checkParentIsExist(testID)
      .catch((err) => (error = err));

    expect(Category.findByPk).toHaveBeenLastCalledWith(testID);
  });
});

describe("checkParentIdLegality()", () => {
  beforeAll(() => {
    vi.spyOn(categoryHelper, "checkParentIsExist").mockImplementation(
      async () => {}
    );
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should throw error if parent is not a number", async () => {
    let error;
    const testParentId = "testParentId";
    await categoryHelper
      .checkParentIdLegality(testParentId)
      .catch((err) => (error = err));

    expect(error).toEqual(errorTable.notNumberError("ParentId"));
  });

  test("should call checkParentIsExist() by ParentId", async () => {
    let error;
    const testParentId = "1";
    await categoryHelper
      .checkParentIdLegality(testParentId)
      .catch((err) => (error = err));

    expect(categoryHelper.checkParentIsExist).toHaveBeenLastCalledWith(
      testParentId
    );
  });
});

describe("isRoot()", () => {
  test("should retrun true if category name is root", () => {
    const category = { name: "root" };

    expect(categoryHelper.isRoot(category)).toBe(true);
  });

  test("should retrun false if category name is not root", () => {
    const category = { name: "test" };

    expect(categoryHelper.isRoot(category)).toBe(false);
  });

  test("should retrun false if category is null", () => {
    const category = {};

    expect(categoryHelper.isRoot(category)).toBe(false);
  });
});

describe("getCategoryChildren()", () => {
  test("should retrun children if ParentId is equal to currentCategoryId", () => {
    const testID = 1;
    const categoryList = [
      { name: "categroyA", ParentId: testID },
      { name: "categroyB", ParentId: testID },
      { name: "categroyC", ParentId: 3 },
    ];

    const result = categoryHelper.getCategoryChildren(categoryList, testID);

    expect(result).toEqual([
      { name: "categroyA", ParentId: testID },
      { name: "categroyB", ParentId: testID },
    ]);
  });

  test("should retrun empty array if none of the ParentIds are equal to currentCategoryId", () => {
    const testID = "testID";
    const categoryList = [
      { name: "categroyA", ParentId: 1 },
      { name: "categroyB", ParentId: 2 },
      { name: "categroyC", ParentId: 3 },
    ];

    const result = categoryHelper.getCategoryChildren(categoryList, testID);

    expect(result).toEqual([]);
  });
});

describe("checkCircularReference()", () => {
  test("should retrun true if currentCategoryId is equal to newParentId", () => {
    const testID = "1";

    const result = categoryHelper.checkCircularReference([], testID, testID);

    expect(result).toBe(true);
  });

  test("should retrun false if children is not found in categories", () => {
    const testID = "testID";
    const anotherTestID = "anotherTestID";

    const result = categoryHelper.checkCircularReference(
      [],
      testID,
      anotherTestID
    );

    expect(result).toBe(false);
  });

  test("should retrun true if circular reference happen", () => {
    const categories = [
      { id: 1, ParentId: null },
      { id: 2, ParentId: 1 },
      { id: 3, ParentId: 2 },
    ];

    const result = categoryHelper.checkCircularReference(categories, 2, 3);

    expect(result).toBe(true);
  });

  test("should retrun false if circular reference not happen", () => {
    const categories = [
      { id: 1, ParentId: null },
      { id: 2, ParentId: 1 },
      { id: 3, ParentId: 1 },
    ];

    const result = categoryHelper.checkCircularReference(categories, 2, 3);

    expect(result).toBe(false);
  });
});

describe("checkCategoryCircularReference()", () => {
  beforeAll(() => {
    vi.spyOn(Category, "findAll").mockImplementation(async () => {});
    vi.spyOn(categoryHelper, "checkCircularReference").mockImplementation(
      () => {}
    );
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should has property", async () => {
    const testCategories = "testCategories";
    const testCurrentCategoryId = "testCurrentCategoryId";
    const testNewParentId = "testBewParentId";
    Category.findAll.mockResolvedValueOnce(testCategories);

    await categoryHelper.checkCategoryCircularReference(
      testCurrentCategoryId,
      testNewParentId
    );

    expect(categoryHelper.checkCircularReference).toHaveBeenLastCalledWith(
      testCategories,
      testCurrentCategoryId,
      testNewParentId
    );
  });

  test("should throw error if circular reference happen", async () => {
    let error;
    categoryHelper.checkCircularReference.mockImplementation(() => true);

    await categoryHelper
      .checkCategoryCircularReference()
      .catch((err) => (error = err));

    expect(error).toEqual(errorTable.circularReferenceHappenError());
  });

  test("should not throw error if circular reference does not happen", async () => {
    let error;
    categoryHelper.checkCircularReference.mockImplementation(() => false);

    await categoryHelper
      .checkCategoryCircularReference()
      .catch((err) => (error = err));

    expect(error).toBeUndefined();
  });
});
