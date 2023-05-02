import fs from "fs";
import {
  sendDevError,
  sendProductError,
  handleUnknownError,
  isOperationaleError,
  removeFileWhenError,
  handleOperationalError,
} from "./handle-error";
import errorHandler from "./handle-error";
import * as customError from "./custom-error";
import { beforeAll } from "vitest";

//---------------------------------Dev------------------------------------
describe("sendDevError()", () => {
  let res;
  beforeEach(() => {
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
  });

  test("should response error detail", () => {
    const err = {
      statusCode: 400,
      status: "fail",
      message: "Test message",
      stack: "Test stack",
      isOperational: true,
    };

    sendDevError(err, res);

    expect(res.status).toHaveBeenLastCalledWith(err.statusCode);
    expect(res.json).toHaveBeenLastCalledWith({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  });
});

//---------------------------------Prod------------------------------------
describe("isOperationaleError()", () => {
  test("should return true if error is operantional", () => {
    const err = { isOperational: true };
    expect(isOperationaleError(err)).toBe(true);
  });

  test("should return false if error is not operantional", () => {
    const err = {};
    expect(isOperationaleError(err)).toBeFalsy();
  });
});

describe("handleOperationalError()", () => {
  let res;
  beforeEach(() => {
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
  });

  test("should response error detail", () => {
    const err = {
      statusCode: 400,
      status: "fail",
      message: "Test message",
      stack: "Test stack",
      isOperational: true,
    };

    handleOperationalError(err, res);

    expect(res.status).toHaveBeenLastCalledWith(err.statusCode);
    expect(res.json).toHaveBeenLastCalledWith({
      status: err.status,
      message: err.message,
    });
  });
});

describe("handleUnknownError()", () => {
  let res;
  beforeEach(() => {
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
  });

  test("should response error detail", () => {
    const err = {};

    handleUnknownError(err, res);

    expect(res.status).toHaveBeenLastCalledWith(500);
    expect(res.json).toHaveBeenLastCalledWith({
      status: "error",
      message: "An unknown error occurred...",
    });
  });
});

describe("sendProductError()", () => {
  let res;
  let err;
  beforeEach(() => {
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    err = {
      statusCode: 400,
      status: "fail",
      message: "Test message",
      stack: "Test stack",
    };
  });

  test("should response operational error", () => {
    err.isOperational = true;

    sendProductError(err, res);

    expect(res.status).toHaveBeenLastCalledWith(err.statusCode);
    expect(res.json).toHaveBeenLastCalledWith({
      status: err.status,
      message: err.message,
    });
  });

  test("should response unknown error", () => {
    err.isOperational = false;

    sendProductError(err, res);

    expect(res.status).toHaveBeenLastCalledWith(500);
    expect(res.json).toHaveBeenLastCalledWith({
      status: "error",
      message: "An unknown error occurred...",
    });
  });
});

//-------------------------------Error boundary--------------------------------------

describe("removeFileWhenError()", () => {
  beforeEach(() => {
    vi.spyOn(fs, "unlink").mockImplementationOnce();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should remove file if error occur", () => {
    let err;
    const req = { file: { path: "test" } };

    removeFileWhenError(req, err);

    expect(fs.unlink.mock.calls[0][0]).toBe("test");
  });
});

describe("errorHandler()", () => {
  let req;
  let res;
  let err;
  beforeEach(() => {
    req = { file: null };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    err = {
      statusCode: 400,
      status: "fail",
      message: "Test message",
      stack: "Test stack",
      isOperational: true,
    };
  });

  describe("APP_ENV=test", () => {
    beforeAll(() => {
      process.env.APP_ENV = "test";
    });

    afterAll(() => {
      delete process.env.APP_ENV;
    });

    test.each(["fail", "error", "test"])(
      "should  err has status if provided",
      (status) => {
        const err = { status };

        errorHandler(err, req, res, null);

        expect(err.status).toBe(status);
      }
    );

    test("should has default error status if not provided", () => {
      err = {};

      errorHandler(err, req, res, null);

      expect(err.status).toBe("error");
    });

    test.each([200, 400])(
      "should has err statusCode if provided",
      (statusCode) => {
        const err = { statusCode };

        errorHandler(err, req, res, null);

        expect(err.statusCode).toBe(statusCode);
      }
    );

    test("should has default error statusCode if not provided", () => {
      const err = {};

      errorHandler(err, req, res, null);

      expect(err.statusCode).toBe(500);
    });
  });

  describe("APP_ENV=dev", () => {
    beforeAll(() => {
      process.env.APP_ENV = "development";
    });

    afterAll(() => {
      delete process.env.APP_ENV;
    });

    test("should provide err and res ", () => {
      errorHandler(err, req, res, null);

      expect(res.status).toHaveBeenLastCalledWith(err.statusCode);

      expect(res.json).toHaveBeenLastCalledWith({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
      });
    });
  });

  describe("APP_ENV=prod", () => {
    beforeAll(() => {
      vi.spyOn(customError, "createCustomSqlError");
      process.env.APP_ENV = "production";
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    afterAll(() => {
      delete process.env.APP_ENV;
      vi.restoreAllMocks();
    });

    test("should response json if err is operational", () => {
      errorHandler(err, req, res, null);

      expect(res.status).toHaveBeenLastCalledWith(err.statusCode);
      expect(res.json).toHaveBeenLastCalledWith({
        status: err.status,
        message: err.message,
      });
    });

    test("should response json if err is not operational error", () => {
      err = { ...err, isOperational: false };

      errorHandler(err, req, res, null);

      expect(res.status).toHaveBeenLastCalledWith(500);
      expect(res.json).toHaveBeenLastCalledWith({
        status: "error",
        message: "An unknown error occurred...",
      });
    });

    test("should response if CustomErrorChoice", () => {
      err = { ...err, name: "CustomError" };
      customError.createCustomSqlError.mockImplementationOnce((err) => err);

      errorHandler(err, req, res, null);

      expect(res.status).toHaveBeenLastCalledWith(400);
      expect(res.json).toHaveBeenLastCalledWith({
        status: "fail",
        message: "Test message",
      });
    });
  });
});
