import gravatar from "gravatar";
import normalize from "normalize-path";
import * as errorTable from "../utils/error/error-table";
import * as shareController from "./share-controller";
import { validationResult } from "express-validator";

vi.mock("gravatar");
vi.mock("normalize-path");
vi.mock("express-validator");
describe("validation()", () => {
  let req, res, next, error;
  beforeAll(() => {
    next = vi.fn();
  });

  beforeEach(() => {
    error = undefined;
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should throw error if there is an error during validation", () => {
    validationResult.mockImplementationOnce(() => ({
      isEmpty() {
        return false;
      },
    }));

    try {
      shareController.validation(req, res, next);
    } catch (err) {
      error = err;
    }

    expect(error).toEqual(errorTable.validateError());
    expect(next).toHaveBeenCalledTimes(0);
  });

  test("should call next if successfully.", () => {
    validationResult.mockImplementationOnce(() => ({
      isEmpty() {
        return true;
      },
    }));

    let error;
    try {
      shareController.validation(req, res, next);
    } catch (err) {
      error = err;
    }

    expect(error).toBeUndefined();
    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe("isFilePath()", () => {
  test("should return true if file has path", () => {
    const file = { path: "testPath" };
    expect(shareController.isFilePath(file)).toBe(true);
  });

  test("should return false if file doesn't have path", () => {
    const file = {};
    expect(shareController.isFilePath(file)).toBe(false);
  });
});

describe("createGravatar()", () => {
  beforeAll(() => {
    vi.spyOn(gravatar, "url");
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should been called if email is provided", () => {
    const email = "test@gmail.com";
    shareController.createGravatar(email);

    expect(gravatar.url).toHaveBeenLastCalledWith(email, {
      protocol: "https",
      d: "identicon",
    });
  });
});

describe("createAvatar()", () => {
  beforeAll(() => {
    vi.spyOn(shareController, "createGravatar");
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should return file path if file has path", () => {
    const file = { path: "testPath" };
    const email = "test@gmail.com";
    normalize.mockImplementationOnce(() => "normalize testPath");

    const result = shareController.createAvatar(email, file);

    expect(result).toBe("normalize testPath");
    expect(normalize).toHaveBeenLastCalledWith(file.path);
  });

  test("should create gravatar if file doesn't have path", () => {
    const file = {};
    const email = "test@gmail.com";
    shareController.createGravatar.mockImplementationOnce(
      () => "createdGravatar"
    );

    const result = shareController.createAvatar(email, file);

    expect(result).toBe("createdGravatar");
    expect(shareController.createGravatar).toHaveBeenLastCalledWith(email);
  });
});
