import * as helper from "../utils/helper/helper";
import * as handleFactory from "./handle-factory";
import * as errorTable from "../utils/error/error-table";
import { GetFeatures } from "../utils/api-features";
import { afterAll, beforeAll } from "vitest";

vi.mock("../utils/api-features");

describe("getOne()", () => {
  let req = { params: { id: 1 } };
  let res, next, error;
  beforeEach(() => {
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    next = vi.fn();
    error = undefined;
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
  let res, next, filter, sort, select, paginate;

  beforeAll(() => {
    vi.spyOn(helper, "setAvatarsUrlFromS3").mockImplementation(async () => {});

    filter = vi.fn().mockReturnThis();
    sort = vi.fn().mockReturnThis();
    select = vi.fn().mockReturnThis();
    paginate = vi.fn().mockReturnThis();

    GetFeatures.mockImplementation((Model, query) => ({
      findAll: vi.fn(async () => Model.findAndCountAll()),
      filter,
      sort,
      select,
      paginate,
    }));
    return { GetFeatures };
  });

  beforeEach(() => {
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    next = vi.fn();
    vi.clearAllMocks();
  });

  test("should get data back if query is correct", async () => {
    const testdata = { count: 1, rows: ["TestDataA", "TestDataB"] };
    const TestModel = { findAndCountAll: vi.fn().mockResolvedValue(testdata) };

    const getAllFunc = handleFactory.getAll(TestModel);
    await getAllFunc(req, res, next);

    expect(helper.setAvatarsUrlFromS3).toHaveBeenLastCalledWith(testdata);
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
  let req = { body: { name: "Tom" } };
  let res;
  let next;
  beforeAll(() => {
    vi.spyOn(helper, "removeKeys");
  });

  beforeEach(() => {
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should create data if req.body is provided", async () => {
    const testdata = {
      test: "TestData",
    };
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
    expect(res.status).toHaveBeenLastCalledWith(200);
    expect(res.json).toHaveBeenLastCalledWith({
      status: "success",
      data: testdata,
    });
  });

  test("should remove date information from the DATA", async () => {
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
    expect(res.status).toHaveBeenLastCalledWith(200);
    expect(res.json).toHaveBeenLastCalledWith({
      status: "success",
      data: testdata,
    });
  });
});

describe("updateOne()", () => {
  let req, res, next, error;
  beforeAll(() => {
    next = vi.fn();
  });

  beforeEach(() => {
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    error = undefined;
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });
  test("should throw error if updated itmes has id", async () => {
    req = { body: { id: "1" } };

    const TestModel = {
      update: vi.fn().mockResolvedValueOnce(),
    };

    const updateOneFunc = handleFactory.updateOne(TestModel);
    await updateOneFunc(req, res, next);
    error = next.mock.calls[0][0];

    expect(error).toEqual(errorTable.notAllowUpdateIDError());
  });

  test("should throw error if updated itmes has id", async () => {
    req = { params: { id: "1" }, body: { name: "Tom" } };

    const TestModel = {
      findByPk: vi.fn().mockResolvedValueOnce(),
      update: vi.fn().mockResolvedValueOnce(),
    };

    const updateOneFunc = handleFactory.updateOne(TestModel);
    await updateOneFunc(req, res, next);
    error = next.mock.calls[0][0];

    expect(error).toEqual(errorTable.idNotFoundError());
  });

  test("should response if request is correct", async () => {
    req = { params: { id: "1" }, body: { name: "Tom" } };
    const testdata = "TestData";

    const TestModel = {
      findByPk: vi.fn().mockResolvedValueOnce(testdata),
      update: vi.fn().mockResolvedValueOnce(),
    };

    const updateOneFunc = handleFactory.updateOne(TestModel);
    await updateOneFunc(req, res, next).catch((err) => (error = err));

    expect(TestModel.update).toHaveBeenLastCalledWith(req.body, {
      where: { id: req.params.id },
    });
    expect(TestModel.findByPk).toHaveBeenLastCalledWith(req.params.id, {
      raw: true,
    });
    expect(res.status).toHaveBeenLastCalledWith(200);
    expect(res.json).toHaveBeenLastCalledWith({
      status: "success",
      data: testdata,
    });
  });
});

describe("deleteOne()", () => {
  let req = { params: { id: "test" } };
  let res;
  let next;

  beforeAll(() => {
    vi.spyOn(helper, "deleteAvatarUrlFromS3").mockImplementation(
      async () => {}
    );
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
