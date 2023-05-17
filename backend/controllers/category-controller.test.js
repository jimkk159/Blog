import Category from "../module/category";
import * as helper from "../utils/helper/helper";
import * as categoryHelper from "../utils/helper/category-helper";
import * as errorTable from "../utils/error/error-table";
import * as categoryController from "./category-controller";

const testParentID = "2";
describe("createOne()", () => {
  let req, res, next;

  beforeAll(() => {
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    next = vi.fn();
    vi.spyOn(helper, "removeKeys");
    vi.spyOn(Category, "findOrCreate").mockImplementation(async () => {});
    vi.spyOn(categoryHelper, "checkParentIsExist").mockImplementation(
      async () => {}
    );
  });

  beforeEach(() => {
    req = {};
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should throw error if ParentId is not a number", async () => {
    let error;
    req = { body: { ParentId: "Not a number" } };

    await categoryController.createOne(req, res, next);
    error = next.mock.calls[0][0];

    expect(error).toEqual(errorTable.notNumberError("ParentId"));
  });

  test("should call checkParentIsExist() by ParentId", async () => {
    req = { body: { ParentId: testParentID } };

    await categoryController.createOne(req, res, next);

    expect(categoryHelper.checkParentIsExist).toHaveBeenLastCalledWith(
      testParentID
    );
  });

  test("should find or create category", async () => {
    req = { body: { name: "testName", ParentId: testParentID } };

    await categoryController.createOne(req, res, next);

    expect(Category.findOrCreate).toHaveBeenLastCalledWith({
      where: { name: req.body.name },
      defaults: {
        ParentId: req.body.ParentId,
      },
    });
  });

  test("should throw error if category already exist", async () => {
    let error;
    req = { body: { name: "testName", ParentId: testParentID } };
    Category.findOrCreate.mockResolvedValueOnce([]);

    await categoryController.createOne(req, res, next);
    error = next.mock.calls[0][0];

    expect(error).toEqual(errorTable.categoryAlreadyExistError());
  });

  test("should remove date information from the category", async () => {
    req = { body: { name: "testName", ParentId: testParentID } };
    const resCategory = {
      id: "testID",
      name: "testName",
      ParentId: testParentID,
    };
    const category = {
      ...resCategory,
      updatedAt: "updatedAt",
      createdAt: "createdAt",
      toJSON: () => resCategory,
    };
    Category.findOrCreate.mockResolvedValueOnce([category, true]);

    await categoryController.createOne(req, res, next);

    expect(helper.removeKeys).toHaveBeenLastCalledWith(category.toJSON(), [
      "updatedAt",
      "createdAt",
    ]);
  });

  test("should response created category", async () => {
    req = { body: { name: "testName", ParentId: testParentID } };
    const resCategory = {
      id: "testID",
      name: "testName",
      ParentId: testParentID,
    };
    const category = {
      ...resCategory,
      updatedAt: "updatedAt",
      createdAt: "createdAt",
      toJSON: () => resCategory,
    };
    Category.findOrCreate.mockResolvedValueOnce([category, true]);

    await categoryController.createOne(req, res, next);

    expect(res.status).toHaveBeenLastCalledWith(200);
    expect(res.json).toHaveBeenLastCalledWith({
      status: "success",
      data: resCategory,
    });
  });
});

describe("updateOne()", () => {
  let req, res, next;

  beforeAll(() => {
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    next = vi.fn();
    vi.spyOn(Category, "findByPk").mockImplementation(async () => {});
    vi.spyOn(Category, "update").mockImplementation(async () => {});
    vi.spyOn(Category, "findAll").mockImplementation(async () => {});
    vi.spyOn(categoryHelper, "checkParentIdLegality").mockImplementation(
      async () => {}
    );
    vi.spyOn(categoryHelper, "checkParentIsExist").mockImplementation(
      async () => {}
    );
    vi.spyOn(
      categoryHelper,
      "checkCategoryCircularReference"
    ).mockImplementation(async () => {});
  });

  beforeEach(() => {
    req = {};
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should call checkParentIdLegality() ParentId if ParentId is provided", async () => {
    req = { body: { ParentId: "Not a number" } };

    await categoryController.updateOne(req, res, next);

    expect(categoryHelper.checkParentIdLegality).toHaveBeenLastCalledWith(
      req.body.ParentId
    );
  });

  test("should not call checkParentIdLegality() ParentId if ParentId is not provided", async () => {
    req = { body: {} };

    await categoryController.updateOne(req, res, next);

    expect(categoryHelper.checkParentIdLegality).not.toHaveBeenCalled();
  });

  test("should find category from database by id", async () => {
    req = {
      params: { id: "testID" },
      body: { name: "testName", ParentId: testParentID },
    };

    await categoryController.updateOne(req, res, next);

    expect(Category.findByPk).toHaveBeenLastCalledWith(req.params.id);
  });

  test("should throw error if category not found by id", async () => {
    let error;
    req = {
      params: { id: "testID" },
      body: { name: "testName", ParentId: testParentID },
    };

    await categoryController.updateOne(req, res, next);
    error = next.mock.calls[0][0];

    expect(error).toEqual(errorTable.categoryNotFound());
  });

  test("should throw error if updat category is root", async () => {
    let error;
    req = {
      params: { id: "testID" },
      body: { name: "testName", ParentId: testParentID },
    };
    Category.findByPk.mockResolvedValueOnce({ name: "root" });

    await categoryController.updateOne(req, res, next);
    error = next.mock.calls[0][0];

    expect(error).toEqual(errorTable.notAllowUpdateRootError());
  });

  test("should call checkCategoryCircularReference() by founded CategoryId and provided ParentId if ParentId is provided", async () => {
    req = {
      params: { id: "testID" },
      body: { name: "testCategory", ParentId: testParentID },
    };
    const category = {
      id: "testID",
      name: "testCategory",
      ParentId: testParentID,
    };
    Category.findByPk.mockResolvedValueOnce(category);

    await categoryController.updateOne(req, res, next);

    expect(
      categoryHelper.checkCategoryCircularReference
    ).toHaveBeenLastCalledWith(category.id, req.body.ParentId);
  });

  test("should not call checkCategoryCircularReference() by founded CategoryId and provided ParentId if ParentId is not provided", async () => {
    req = {
      params: { id: "testID" },
      body: { name: "testCategory" },
    };
    const category = {
      id: "testID",
      name: "testCategory",
      ParentId: testParentID,
    };
    Category.findByPk.mockResolvedValueOnce(category);

    await categoryController.updateOne(req, res, next);

    expect(
      categoryHelper.checkCategoryCircularReference
    ).not.toHaveBeenCalled();
  });

  test("should update category by provided ParentId", async () => {
    req = {
      params: { id: "testID" },
      body: { name: "testCategory", ParentId: testParentID },
    };
    const category = {
      id: "testID",
      name: "testCategory",
    };
    Category.findByPk.mockResolvedValueOnce(category);

    await categoryController.updateOne(req, res, next);

    expect(Category.update).toHaveBeenLastCalledWith(
      { name: req.body.name, ParentId: req.body.ParentId },
      { where: { id: req.params.id } }
    );
  });

  test("should response if update successfully", async () => {
    req = {
      params: { id: "testID" },
      body: { name: "testCategory", ParentId: testParentID },
    };
    const category = {
      id: "testID",
      name: "testCategory",
    };
    const categorires = [
      {
        id: 1,
        name: "root",
        ParentId: null,
      },
      {
        id: 2,
        name: "A",
        ParentId: 1,
      },
      {
        id: 3,
        name: "B",
        ParentId: 2,
      },
      {
        id: 4,
        name: "C",
        ParentId: 1,
      },
    ];
    Category.findByPk.mockResolvedValueOnce(category);
    Category.findAll.mockResolvedValueOnce(categorires);

    await categoryController.updateOne(req, res, next);

    expect(res.status).toHaveBeenLastCalledWith(200);
    expect(res.json).toHaveBeenLastCalledWith({
      status: "success",
      data: categorires,
    });
  });
});

describe("deleteOne()", () => {
  let req, res, next;

  beforeAll(() => {
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    next = vi.fn();
    vi.spyOn(Category, "findByPk").mockImplementation(async () => {});
    vi.spyOn(Category, "destroy").mockImplementation(async () => {});
  });

  beforeEach(() => {
    req = {};
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should find category by id", async () => {
    req = { params: { id: "testID" } };

    await categoryController.deleteOne(req, res, next);

    expect(Category.findByPk).toHaveBeenLastCalledWith(req.params.id);
  });

  test("should throw error if category not found", async () => {
    let error;
    req = { params: { id: "testID" } };

    await categoryController.deleteOne(req, res, next);
    error = next.mock.calls[0][0];

    expect(error).toEqual(errorTable.categoryNotFound());
  });

  test("should throw error if deleted category is root", async () => {
    let error;
    req = { params: { id: "testID" } };
    const category = { name: "root" };
    Category.findByPk.mockResolvedValueOnce(category);

    await categoryController.deleteOne(req, res, next);
    error = next.mock.calls[0][0];

    expect(error).toEqual(errorTable.notAllowDeleteRootError());
  });

  test("should delete category by id", async () => {
    req = { params: { id: "testID" } };
    const category = { name: "testName" };
    Category.findByPk.mockResolvedValueOnce(category);

    await categoryController.deleteOne(req, res, next);

    expect(Category.destroy).toHaveBeenLastCalledWith({
      where: { id: req.params.id },
    });
  });

  test("should response if delete successfully!", async () => {
    req = { params: { id: "testID" } };
    const category = { name: "testName" };
    Category.findByPk.mockResolvedValueOnce(category);

    await categoryController.deleteOne(req, res, next);

    expect(res.status).toHaveBeenLastCalledWith(204);
    expect(res.json).toHaveBeenCalled();
  });
});
