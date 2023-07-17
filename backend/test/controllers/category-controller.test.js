import Post from "../../module/post";
import sequelize from "../../config/db-init";
import Category from "../../module/category";
import * as helper from "../../utils/helper/helper";
import * as errorTable from "../../utils/error/error-table";
import * as cacheHelper from "../../utils/helper/cache-helper";
import * as categoryHelper from "../../utils/helper/category-helper";
import * as categoryController from "../../controllers/category-controller";

vi.mock("redis");
vi.mock("sequelize");

// describe("init", () => {
//   beforeAll(() => {
//     vi.spyOn(Category, "findOrCreate").mockImplementation(async () => {});
//   });

//   beforeEach(() => {
//     vi.clearAllMocks();
//   });

//   afterAll(() => {
//     vi.restoreAllMocks();
//   });

//   test("should initial create the root category", async () => {
//     await categoryController.init();

//     expect(Category.findOrCreate).toHaveBeenLastCalledWith({
//       where: { name: "root" },
//     });
//   });

//   test("should throw error if initial create the root category fail", async () => {
//     let error;
//     Category.findOrCreate.mockImplementationOnce(() => {
//       throw new Error();
//     });

//     await categoryController.init().catch((err) => (error = err));

//     expect(error).toEqual(new Error("initial category table fail"));
//   });
// });

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

  test("should create category", async () => {
    req = { body: { name: "testName", ParentId: testParentID } };

    await categoryController.createOne(req, res, next);

    expect(Category.create).toHaveBeenLastCalledWith({
      ParentId: req.body.ParentId,
      name: helper.modeifiedSyntax(req.body.name),
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
    Category.create.mockResolvedValueOnce(category);

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
    Category.create.mockResolvedValueOnce(category);

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
  let req, res, next, session;

  beforeAll(() => {
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    next = vi.fn();
    session = vi.fn();
    vi.spyOn(sequelize, "transaction").mockImplementation(async (fn) =>
      fn(session)
    );
    vi.spyOn(Post, "update").mockImplementation(async () => {});
    vi.spyOn(Category, "findByPk").mockImplementation(async () => {});
    vi.spyOn(Category, "update").mockImplementation(async () => {});
    vi.spyOn(Category, "destroy").mockImplementation(async () => {});
    vi.spyOn(cacheHelper, "delCache").mockImplementation(async () => {});
  });

  beforeEach(() => {
    req = { params: { id: "testID" }, originalUrl: "testOriginalUrl" };
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should find category by id", async () => {
    await categoryController.deleteOne(req, res, next);

    expect(Category.findByPk).toHaveBeenLastCalledWith(req.params.id);
  });

  test("should throw error if category not found", async () => {
    let error;

    await categoryController.deleteOne(req, res, next);
    error = next.mock.calls[0][0];

    expect(error).toEqual(errorTable.categoryNotFound());
  });

  test("should throw error if deleted category is root", async () => {
    let error;
    const category = { name: "root" };
    Category.findByPk.mockResolvedValueOnce(category);

    await categoryController.deleteOne(req, res, next);
    error = next.mock.calls[0][0];

    expect(error).toEqual(errorTable.notAllowDeleteRootError());
  });

  test("should update the category children to its parent", async () => {
    const category = { name: "testName", ParentId: "testParentId" };
    Category.findByPk.mockResolvedValueOnce(category);

    await categoryController.deleteOne(req, res, next);

    expect(Category.update).toHaveBeenLastCalledWith(
      { ParentId: category.ParentId },
      {
        where: { ParentId: req.params.id },
        transaction: session,
      }
    );
  });

  test("should update the category children to its parent", async () => {
    const category = { name: "testName", ParentId: "testParentId" };
    Category.findByPk.mockResolvedValueOnce(category);

    await categoryController.deleteOne(req, res, next);

    expect(Category.update).toHaveBeenLastCalledWith(
      { ParentId: category.ParentId },
      {
        where: { ParentId: req.params.id },
        transaction: session,
      }
    );
  });

  test("should update the post to its origin category parent", async () => {
    const category = { name: "testName", ParentId: "testParentId" };
    Category.findByPk.mockResolvedValueOnce(category);

    await categoryController.deleteOne(req, res, next);

    expect(Post.update).toHaveBeenLastCalledWith(
      { CategoryId: category.ParentId },
      {
        where: { CategoryId: req.params.id },
        transaction: session,
      }
    );
  });

  test("should delete category by id", async () => {
    const category = { name: "testName" };
    Category.findByPk.mockResolvedValueOnce(category);

    await categoryController.deleteOne(req, res, next);

    expect(Category.destroy).toHaveBeenLastCalledWith({
      where: { id: req.params.id },
      transaction: session,
    });
  });

  test("should delete remain cache", async () => {
    const category = { name: "testName" };
    Category.findByPk.mockResolvedValueOnce(category);

    await categoryController.deleteOne(req, res, next);

    expect(cacheHelper.delCache).toHaveBeenLastCalledWith(req.originalUrl);
  });

  test("should response if delete successfully!", async () => {
    const category = { name: "testName" };
    Category.findByPk.mockResolvedValueOnce(category);

    await categoryController.deleteOne(req, res, next);

    expect(res.status).toHaveBeenLastCalledWith(204);
    expect(res.json).toHaveBeenCalled();
  });
});
