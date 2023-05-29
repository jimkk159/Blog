import * as s3 from "../../utils/aws/s3";
import * as userController from "../../controllers/user-controller";
import * as errorTable from "../../utils/error/error-table";

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

  test("should remove the update information for avatar", async () => {
    req.body = { avatar: "Test" };

    await userController.updateMe(req, res, next);

    expect(req.body.avatar).toBeUndefined();
  });

  test("should has property if set update information successfully!", async () => {
    req = {
      user: { id: "testID" },
      file: { path: "testPath" },
      body: { name: "Tom" },
      params: {},
    };

    await userController.updateMe(req, res, next);

    expect(req.params.id).toBe("testID");
    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe("updateAvatar()", () => {
  let req, res, next, error;

  beforeAll(() => {
    next = vi.fn();
    vi.spyOn(s3, "uploadToS3").mockImplementation(() => {});
  });

  beforeEach(() => {
    req = {};
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should not upload the request file to aws S3 if file doest not exist", async () => {
    req = { params: {}, user: { id: "testId" } };

    await userController.updateAvatar(req, res, next);

    expect(s3.uploadToS3).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  test("should upload the request file to aws S3", async () => {
    req = { params: {}, user: { id: "testId" }, file: vi.fn() };

    await userController.updateAvatar(req, res, next);

    expect(s3.uploadToS3).toHaveBeenCalledWith(req.file);
    expect(next).toHaveBeenCalled();
  });

  test("should update the avatar information into the body after upload to the s3", async () => {
    req = { params: {}, user: { id: "testId" }, file: vi.fn() };
    s3.uploadToS3.mockImplementation(async () => "testAvatar");

    await userController.updateAvatar(req, res, next);

    expect(req.body).toEqual({ avatar: "testAvatar" });
  });
});
