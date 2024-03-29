import * as helper from "../../utils/helper/helper";
import { GetFeatures } from "../../utils/api-features";
import * as errorTable from "../../utils/error/error-table";
import * as cacheHelper from "../../utils/helper/cache-helper";
import * as handleFactory from "../../controllers/handle-factory";
import * as apiFeatureHelper from "../../utils/helper/api-feature-helper";

vi.mock("redis");
vi.mock("sequelize");
vi.mock("../../utils/api-features");
describe("getOne()", () => {
  let req = { params: { id: 1 }, query: {}, originalUrl: "testOriginalUrl" };
  let res, next, error;
  beforeAll(() => {
    error = undefined;
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    next = vi.fn();
    vi.spyOn(apiFeatureHelper, "createPopulateObjs").mockImplementation(
      () => {}
    );
    vi.spyOn(cacheHelper, "getOrSetCache").mockImplementation(async (key, cb) =>
      cb()
    );
  });

  beforeEach(() => {
    vi.clearAllMocks();
    error = undefined;
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should get data from cache or database", async () => {
    const TestModel = { findByPk: vi.fn().mockResolvedValueOnce() };

    const getOneFunc = handleFactory.getOne(TestModel);
    await getOneFunc(req, res, next);

    expect(cacheHelper.getOrSetCache.mock.calls[0][0]).toBe(req.originalUrl);
  });

  test("should get data if id is existed in database", async () => {
    const testdata = "TestData";
    const TestModel = { findByPk: vi.fn().mockResolvedValueOnce(testdata) };

    const getOneFunc = handleFactory.getOne(TestModel);
    await getOneFunc(req, res, next);

    expect(res.status).toHaveBeenLastCalledWith(200);
    expect(res.json).toHaveBeenLastCalledWith({
      status: "success",
      data: testdata,
    });
  });

  test("should throw error if id is not existed in database", async () => {
    const TestModel = { findByPk: vi.fn().mockResolvedValue() };

    const getOneFunc = handleFactory.getOne(TestModel);
    await getOneFunc(req, res, next);
    error = next.mock.calls[0][0];

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(error).toEqual(errorTable.idNotFoundError());
  });
});

describe("getAll()", () => {
  let req = { query: {} };
  let res, next, filter, sort, select, paginate, pop;

  beforeAll(() => {
    filter = vi.fn().mockReturnThis();
    sort = vi.fn().mockReturnThis();
    select = vi.fn().mockReturnThis();
    paginate = vi.fn().mockReturnThis();
    pop = vi.fn().mockReturnThis();

    GetFeatures.mockImplementation((Model, query) => ({
      findAll: vi.fn(async () => Model.findAndCountAll()),
      filter,
      sort,
      select,
      paginate,
      pop,
    }));

    vi.spyOn(cacheHelper, "getOrSetCache").mockImplementation(async (key, cb) =>
      cb()
    );
  });

  beforeEach(() => {
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    next = vi.fn();
    vi.clearAllMocks();
  });

  test("should get data from cache or database", async () => {
    const TestModel = { findByPk: vi.fn().mockResolvedValueOnce() };

    const getOneFunc = handleFactory.getOne(TestModel);
    await getOneFunc(req, res, next);

    expect(cacheHelper.getOrSetCache.mock.calls[0][0]).toBe(req.originalUrl);
  });

  test("should get data back if query is correct", async () => {
    const testdata = { count: 1, rows: ["TestDataA", "TestDataB"] };
    const TestModel = { findAndCountAll: vi.fn().mockResolvedValue(testdata) };

    const getAllFunc = handleFactory.getAll(TestModel);
    await getAllFunc(req, res, next);

    expect(res.status).toHaveBeenLastCalledWith(200);
    expect(res.json).toHaveBeenLastCalledWith({
      status: "success",
      count: testdata.length,
      data: testdata,
    });
  });

  test("should filter, sort, select, paginate are called", async () => {
    const testdata = { count: 1, rows: ["TestDataA", "TestDataB"] };
    const TestModel = { findAndCountAll: vi.fn().mockResolvedValue(testdata) };

    const getAllFunc = handleFactory.getAll(TestModel);
    await getAllFunc(req, res, next);

    expect(filter).toHaveBeenCalledTimes(1);
    expect(sort).toHaveBeenCalledTimes(1);
    expect(select).toHaveBeenCalledTimes(1);
    expect(paginate).toHaveBeenCalledTimes(1);
  });
});

describe("createOne()", () => {
  let req = { originalUrl: "testOriginalUrl", body: { name: "Tom" } };
  let res;
  let next;
  beforeAll(() => {
    vi.spyOn(helper, "removeKeys");
    vi.spyOn(cacheHelper, "delKey").mockImplementation(async () => {});
  });

  beforeEach(() => {
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should response data by created data", async () => {
    const testdata = { test: "TestData" };
    const TestModel = {
      create: vi.fn().mockResolvedValueOnce({
        toJSON() {
          return testdata;
        },
      }),
    };

    const createOneFunc = handleFactory.createOne(TestModel);
    await createOneFunc(req, res, next);

    expect(res.status).toHaveBeenLastCalledWith(200);
    expect(res.json).toHaveBeenLastCalledWith({
      status: "success",
      data: testdata,
    });
  });

  test("should remove date information from the data", async () => {
    const testdata = {
      test: "TestData",
    };
    const dbTestData = {
      ...testdata,
      updatedAt: "testUpdatedAt",
      createdAt: "testCreatedAt",
    };
    const TestModel = {
      create: vi.fn().mockResolvedValueOnce({
        toJSON() {
          return dbTestData;
        },
      }),
    };

    const createOneFunc = handleFactory.createOne(TestModel);
    await createOneFunc(req, res, next);

    expect(helper.removeKeys).toHaveBeenLastCalledWith(dbTestData, [
      "updatedAt",
      "createdAt",
    ]);
  });

  test("should remove remain cache ", async () => {
    const testdata = { test: "TestData" };
    const TestModel = {
      create: vi.fn().mockResolvedValueOnce({
        toJSON() {
          return testdata;
        },
      }),
    };

    const createOneFunc = handleFactory.createOne(TestModel);
    await createOneFunc(req, res, next);

    expect(cacheHelper.delKey).toHaveBeenLastCalledWith(req.originalUrl);
  });

  test("should create data by provided Model", async () => {
    const testdata = { test: "TestData" };
    const TestModel = {
      create: vi.fn().mockResolvedValueOnce({
        toJSON() {
          return testdata;
        },
      }),
    };

    const createOneFunc = handleFactory.createOne(TestModel);
    await createOneFunc(req, res, next);

    expect(TestModel.create).toHaveBeenLastCalledWith(req.body);
  });

  test("should response data without date information", async () => {
    const testdata = {
      test: "TestData",
    };
    const dbTestData = {
      ...testdata,
      updatedAt: "testUpdatedAt",
      createdAt: "testCreatedAt",
    };
    const TestModel = {
      create: vi.fn().mockResolvedValueOnce({
        toJSON() {
          return dbTestData;
        },
      }),
    };

    const createOneFunc = handleFactory.createOne(TestModel);
    await createOneFunc(req, res, next);

    expect(res.status).toHaveBeenLastCalledWith(200);
    expect(res.json).toHaveBeenLastCalledWith({
      status: "success",
      data: testdata,
    });
  });
});

describe("updateOne()", () => {
  const testUpdatedData = "TestData";
  let req, res, next, error, TestModel;
  beforeAll(() => {
    next = vi.fn();
    vi.spyOn(cacheHelper, "delCache").mockImplementation(async () => {});
  });

  beforeEach(() => {
    req = {
      params: { id: "1" },
      body: { name: "Tom" },
      originalUrl: "testOriginalUrl",
    };
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    error = undefined;
    TestModel = {
      findByPk: vi.fn().mockResolvedValueOnce(testUpdatedData),
      update: vi.fn().mockResolvedValueOnce(),
    };
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });
  test("should throw error if user want to update id", async () => {
    req = { body: { id: "1" } };

    const TestModel = {
      update: vi.fn().mockResolvedValueOnce(),
    };

    const updateOneFunc = handleFactory.updateOne(TestModel);
    await updateOneFunc(req, res, next);
    error = next.mock.calls[0][0];

    expect(error).toEqual(errorTable.notAllowUpdateIDError());
  });

  test("should update the data", async () => {
    const updateOneFunc = handleFactory.updateOne(TestModel);
    await updateOneFunc(req, res, next).catch((err) => (error = err));

    expect(TestModel.update).toHaveBeenLastCalledWith(req.body, {
      where: { id: req.params.id },
    });
  });

  test("should find updated data if exist", async () => {
    const updateOneFunc = handleFactory.updateOne(TestModel);
    await updateOneFunc(req, res, next).catch((err) => (error = err));

    expect(TestModel.findByPk).toHaveBeenLastCalledWith(req.params.id, {
      raw: true,
    });
  });

  test("should throw error if updated data does not exist", async () => {
    TestModel = {
      findByPk: vi.fn().mockResolvedValueOnce(),
      update: vi.fn().mockResolvedValueOnce(),
    };

    const updateOneFunc = handleFactory.updateOne(TestModel);
    await updateOneFunc(req, res, next);
    error = next.mock.calls[0][0];

    expect(error).toEqual(errorTable.idNotFoundError());
  });

  test("should remove remain cache", async () => {
    const updateOneFunc = handleFactory.updateOne(TestModel);
    await updateOneFunc(req, res, next).catch((err) => (error = err));

    expect(cacheHelper.delCache).toHaveBeenLastCalledWith(req.originalUrl);
  });

  test("should response if request is correct", async () => {
    const updateOneFunc = handleFactory.updateOne(TestModel);
    await updateOneFunc(req, res, next).catch((err) => (error = err));

    expect(res.status).toHaveBeenLastCalledWith(200);
    expect(res.json).toHaveBeenLastCalledWith({
      status: "success",
      data: testUpdatedData,
    });
  });
});

describe("deleteOne()", () => {
  let req = { params: { id: "test" }, originalUrl: "testOriginalUrl" };
  let res;
  let next;

  beforeAll(() => {
    vi.spyOn(helper, "deleteAvatarUrlFromS3").mockImplementation(
      async () => {}
    );
    vi.spyOn(cacheHelper, "delCache").mockImplementation(async () => {});
  });

  beforeEach(() => {
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should find data by id", async () => {
    const TestModel = {
      destroy: vi.fn().mockResolvedValueOnce(),
      findByPk: vi.fn().mockResolvedValueOnce(),
    };

    const deleteOneFunc = handleFactory.deleteOne(TestModel);
    await deleteOneFunc(req, res, next);

    expect(TestModel.findByPk).toHaveBeenLastCalledWith(req.params.id);
  });

  test("should find data by id", async () => {
    const TestModel = {
      destroy: vi.fn().mockResolvedValueOnce(),
      findByPk: vi.fn().mockResolvedValueOnce(),
    };

    const deleteOneFunc = handleFactory.deleteOne(TestModel);
    await deleteOneFunc(req, res, next);

    expect(TestModel.findByPk).toHaveBeenLastCalledWith(req.params.id);
  });

  test("should response when delete data is not found", async () => {
    const TestModel = {
      destroy: vi.fn().mockResolvedValueOnce(),
      findByPk: vi.fn().mockResolvedValueOnce(),
    };

    const deleteOneFunc = handleFactory.deleteOne(TestModel);
    await deleteOneFunc(req, res, next);

    expect(res.status).toHaveBeenLastCalledWith(204);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  test("should delete data", async () => {
    const testData = { avatar: "testAvatar", data: "testData" };
    const TestModel = {
      destroy: vi.fn().mockResolvedValueOnce(),
      findByPk: vi.fn().mockResolvedValueOnce(testData),
    };

    const deleteOneFunc = handleFactory.deleteOne(TestModel);
    await deleteOneFunc(req, res, next);

    expect(helper.deleteAvatarUrlFromS3).toHaveBeenCalled();
    expect(TestModel.destroy).toHaveBeenLastCalledWith({
      where: { id: req.params.id },
    });
  });

  test("should delete remain cache", async () => {
    const testData = "testData";
    const TestModel = {
      destroy: vi.fn().mockResolvedValueOnce(),
      findByPk: vi.fn().mockResolvedValueOnce(testData),
    };

    const deleteOneFunc = handleFactory.deleteOne(TestModel);
    await deleteOneFunc(req, res, next);

    expect(cacheHelper.delCache).toHaveBeenLastCalledWith(req.originalUrl);
  });

  test("should response when delete data is complete", async () => {
    const testData = "testData";
    const TestModel = {
      destroy: vi.fn().mockResolvedValueOnce(),
      findByPk: vi.fn().mockResolvedValueOnce(testData),
    };

    const deleteOneFunc = handleFactory.deleteOne(TestModel);
    await deleteOneFunc(req, res, next);

    expect(res.status).toHaveBeenLastCalledWith(204);
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});
