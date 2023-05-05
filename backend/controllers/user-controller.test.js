import * as errorTable from "../utils/table/error";
import * as userController from "./user-controller";

describe("setHasValidate()", () => {
  let req, res, next;
  beforeAll(() => {
    next = vi.fn();
  });

  beforeEach(() => {
    req = {};
    vi.clearAllMocks();
  });

  test("should set isEmailValidated to true in body", async () => {
    await userController.setHasValidate(req, res, next);

    expect(req.body.isEmailValidated).toBe(true);
    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe("getMe()", () => {
  let req;
  let res, next;
  beforeAll(() => {
    next = vi.fn();
  });

  beforeEach(() => {
    req = {};
    vi.clearAllMocks();
  });

  test("should set req.params.id is equal to req.user.id", async () => {
    req = { user: { id: "testId" }, params: {} };

    await userController.getMe(req, res, next);

    expect(req.params.id).toBe("testId");
    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe("isUpdatePassword()", () => {
  test.each([
    { password: "Test" },
    { passwordConfirm: "Test" },
    { password: "Test", passwordConfirm: "Test" },
  ])("should return true if password is equal to passwordConfirm", (input) => {
    expect(userController.isUpdatePassword(input)).toBe(true);
  });

  test("should return false if password is not equal to passwordConfirm", () => {
    const input = {};
    expect(userController.isUpdatePassword(input)).toBe(false);
  });
});

describe("updateMe()", () => {
  let req, res, next, error;

  beforeAll(() => {
    next = vi.fn();
  });

  beforeEach(() => {
    req = {};
    error = undefined;
    vi.clearAllMocks();
  });

  test("should throw error if update password", async () => {
    req.body = { password: "Test" };

    await userController.updateMe(req, res, next);
    error = next.mock.calls[0][0];

    expect(error).toEqual(errorTable.notAllowUpdatePasswordError());
  });

  test("should throw error if update email", async () => {
    let error;
    req.body = { email: "Test" };

    await userController.updateMe(req, res, next);
    error = next.mock.calls[0][0];

    expect(error).toEqual(errorTable.notAllowUpdateEmailError());
  });

  test("should has property if set update information successfully!", async () => {
    req = {
      user: { id: "testID" },
      file: { path: "testPath" },
      body: { name: "Tom" },
      params: {},
    };

    await userController.updateMe(req, res, next);

    expect(req.body.avatar).toBe("testPath");
    expect(req.params.id).toBe("testID");
    expect(next).toHaveBeenCalledTimes(1);
  });
});
