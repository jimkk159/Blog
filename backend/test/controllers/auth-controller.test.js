import jwt from "jsonwebtoken";
import Auth from "../../module/auth";
import User from "../../module/user";
import Email from "../../utils/email";
import * as errorTable from "../../utils/error/error-table";
import * as helper from "../../utils/helper/helper";
import * as authHelper from "../../utils/helper/auth-helper";
import * as authController from "../../controllers/auth-controller";
import * as shareController from "../../controllers/share-controller";

const testID = "testID";
const testHost = "testHost";
const token = "testToken";
const role = "testRole";
const avatar = "testAvatar";
const s3Avatar = "testS3Avatar";
const localProvider = "local";
const filePath = "testFilePath";
const testEmail = "test@test.com";
const testPassword = "testPassword";
const verifyToken = "testVerifyToken";
const testNewPassword = "testNewPassword";
const testHashPassword = "testHashPassword";
const testWrongPassword = "testWrongPassword";
const testRandomPassword = "testRandomPassword";

vi.mock("redis");
vi.mock("sequelize");
vi.mock("jsonwebtoken");
vi.mock("../../utils/email");
describe("authUserByToken()", () => {
  let req, res, next, error;
  beforeAll(() => {
    res = vi.fn();
    next = vi.fn();
    vi.spyOn(User, "findByPk").mockImplementation(async () => {});
    vi.spyOn(authHelper, "isUserLegal").mockImplementation(() => {});
    vi.spyOn(authHelper, "isTokenLegal").mockImplementation(async () => {});
  });

  beforeEach(() => {
    req = {};
    error = undefined;
    process.env.JWT_KEY = "";
    vi.clearAllMocks();
  });

  afterAll(() => {
    delete process.env.JWT_KEY;
    vi.restoreAllMocks();
  });

  test("should triger next if request method is 'OPTIONS'(preflight)", async () => {
    req.method = "OPTIONS";

    await authController.authUserByToken(req, res, next);

    expect(res).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  test("should throw error if authentication is empty", async () => {
    req.headers = {};

    await authController.authUserByToken(req, res, next);
    error = next.mock.calls[0][0];

    expect(error).toEqual(errorTable.authTokenNotExistError());
  });

  test("should throw error if jwt is empty", async () => {
    req.headers = { authorization: "Bearer" };

    await authController.authUserByToken(req, res, next);
    error = next.mock.calls[0][0];

    expect(error).toEqual(errorTable.authTokenNotExistError());
  });

  test("should throw error if jwt is verify fail", async () => {
    req.headers = { authorization: `Bearer ${token}` };
    process.env.JWT_KEY = "TEST_JWT_KEY";
    jwt.verify.mockImplementationOnce(() => {
      throw new Error();
    });

    await authController.authUserByToken(req, res, next);
    error = next.mock.calls[0][0];

    expect(jwt.verify).toHaveBeenLastCalledWith(token, process.env.JWT_KEY);
    expect(error).toEqual(errorTable.verifyTokenFailError());
  });

  test.each([undefined])(
    "should throw error if user is not found",
    async (userData) => {
      req.headers = { authorization: `Bearer ${token}` };
      User.findByPk.mockResolvedValueOnce(userData);
      jwt.verify.mockImplementationOnce(() => ({
        uid: testID,
      }));

      await authController.authUserByToken(req, res, next);
      error = next.mock.calls[0][0];

      expect(User.findByPk).toHaveBeenLastCalledWith(testID, {
        attributes: { include: ["role", "isEmailValidated"] },
      });
      expect(error).toEqual(errorTable.userNotExistError());
    }
  );

  test("should throw error if user is not illegal", async () => {
    const userData = "userData";
    const decodeToken = {
      uid: testID,
      provider: "test",
    };
    req.headers = { authorization: `Bearer ${token}` };
    jwt.verify.mockImplementationOnce(() => decodeToken);
    User.findByPk.mockResolvedValueOnce(userData);
    authHelper.isUserLegal.mockReturnValueOnce(false);

    await authController.authUserByToken(req, res, next);
    error = next.mock.calls[0][0];

    expect(authHelper.isUserLegal).toHaveBeenLastCalledWith(
      userData,
      decodeToken.provider
    );
    expect(error).toEqual(errorTable.isNotLegalUserError());
  });

  test("should throw error if token is illegal", async () => {
    const userData = "userData";
    const decodeToken = {
      uid: testID,
      provider: "test",
    };
    req.headers = { authorization: `Bearer ${token}` };
    jwt.verify.mockImplementationOnce(() => decodeToken);
    User.findByPk.mockResolvedValueOnce(userData);
    authHelper.isUserLegal.mockReturnValueOnce(true);
    authHelper.isTokenLegal.mockResolvedValueOnce(false);

    await authController.authUserByToken(req, res, next);
    error = next.mock.calls[0][0];

    expect(authHelper.isTokenLegal).toHaveBeenLastCalledWith(decodeToken);
    expect(error).toEqual(errorTable.verifyTokenFailError());
  });

  test("should get user data if jwt verify successful!", async () => {
    const userData = {
      id: testID,
      name: "Tome",
      avatar,
      role: "user",
      isEmailValidated: true,
    };
    const decodeToken = {
      uid: testID,
      provider: "test",
    };
    req.headers = { authorization: `Bearer ${token}` };
    User.findByPk.mockResolvedValueOnce(userData);
    authHelper.isUserLegal.mockReturnValueOnce(true);
    authHelper.isTokenLegal.mockResolvedValueOnce(true);
    jwt.verify.mockImplementationOnce(() => decodeToken);

    await authController.authUserByToken(req, res, next);

    expect(req.user).toEqual(userData);
    expect(next).toHaveBeenCalled();
  });
});

describe("isIncludeRole()", () => {
  test.each([["user", ["user", "root"]]])(
    "should return true if role is included",
    (role, roles) => {
      expect(authController.isIncludeRole(role, roles)).toBe(true);
    }
  );
  test.each([["client", ["user", "root"]]])(
    "should return false if role is not included",
    (role, roles) => {
      expect(authController.isIncludeRole(role, roles)).toBe(false);
    }
  );
});

describe("restrictTo()", () => {
  let req, res, next, error;
  beforeAll(() => {
    next = vi.fn();
  });

  beforeEach(() => {
    error = undefined;
    vi.clearAllMocks();
  });

  test("should call next if user role is in roles", async () => {
    req = { user: { role: "user" } };
    const middleware = authController.restrictTo("user", "root");
    await middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("should thorw error if user role is not in roles", async () => {
    req = { user: { role: "test" } };
    const middleware = authController.restrictTo("user", "root");
    try {
      await middleware(req, res, next);
    } catch (err) {
      error = err;
    }

    expect(error).toEqual(errorTable.permissionDenyError());
  });
});

describe("signup()", () => {
  let req, res, next, error;

  beforeAll(() => {
    next = vi.fn();
    vi.spyOn(User, "findOne").mockImplementation(async () => {});
    vi.spyOn(shareController, "createAvatar").mockImplementation();
    vi.spyOn(authHelper, "encryptPassword").mockImplementation(async () => {});
    vi.spyOn(authHelper, "createUserAndAuth").mockImplementation(
      async () => {}
    );

    vi.spyOn(authHelper, "updateUserAndAuth").mockImplementation(
      async () => {}
    );
    vi.spyOn(authHelper, "generateRandomCrypto").mockImplementation(() => {});
    vi.spyOn(authHelper, "createEmailValidationToken").mockImplementation(
      () => {}
    );
    vi.spyOn(authHelper, "updateEmailCheckToken").mockImplementation(
      async () => {}
    );
  });

  beforeEach(() => {
    req = {};
    error = undefined;
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should throw error if password and confriim password are not same", async () => {
    req = {
      body: { password: testPassword, confirmPassword: testWrongPassword },
    };

    await authController.signup(req, res, next);
    error = next.mock.calls[0][0];

    expect(error).toEqual(errorTable.passwordNotMatchError());
  });

  test("should throw error if email has created and validted before.", async () => {
    req = {
      body: {
        password: testPassword,
        confirmPassword: testPassword,
        email: testEmail,
      },
    };
    User.findOne.mockResolvedValueOnce({
      getAuths: vi.fn().mockResolvedValueOnce(),
      toJSON: vi.fn().mockReturnValueOnce({ isEmailValidated: true }),
    });

    await authController.signup(req, res, next);
    error = next.mock.calls[0][0];

    expect(error).toEqual(errorTable.emailAlreadyExistError());
  });

  test("should create avatar", async () => {
    req = {
      body: {
        password: testPassword,
        confirmPassword: testPassword,
        email: testEmail,
      },
      file: filePath,
    };

    await authController.signup(req, res, next);

    expect(shareController.createAvatar).toHaveBeenLastCalledWith(
      req.body.email,
      req.file
    );
  });

  test("should encrypt password", async () => {
    req = {
      body: {
        password: testPassword,
        confirmPassword: testPassword,
        email: testEmail,
      },
      file: filePath,
    };

    await authController.signup(req, res, next);

    expect(authHelper.encryptPassword).toHaveBeenLastCalledWith(
      req.body.password
    );
  });

  test("should create user if user is not exist", async () => {
    req = {
      body: {
        name: "Tom",
        password: testPassword,
        confirmPassword: testPassword,
        email: testEmail,
      },
      file: filePath,
    };
    const userInfo = {
      name: req.body.name,
      email: req.body.email,
      avatar,
      role: "user",
    };
    const authInfo = { password: testHashPassword, provider: localProvider };
    shareController.createAvatar.mockReturnValueOnce(avatar);
    authHelper.encryptPassword.mockResolvedValueOnce(testHashPassword);

    await authController.signup(req, res, next);

    expect(authHelper.createUserAndAuth).toHaveBeenLastCalledWith(
      userInfo,
      authInfo
    );
  });

  test("should update user if user is already exist and email is not validated", async () => {
    const userId = 1;
    const newUser = {
      getAuths: vi.fn().mockResolvedValueOnce(["testAuth"]),
      toJSON: vi.fn().mockReturnValueOnce({
        id: userId,
        name: "Bob",
        isEmailValidated: false,
      }),
    };
    req = {
      body: {
        name: "Tom",
        password: testPassword,
        confirmPassword: testPassword,
        email: testEmail,
      },
      file: filePath,
    };
    const userInfo = {
      name: req.body.name,
      email: req.body.email,
      avatar,
      role: "user",
    };
    const authInfo = { password: testHashPassword, provider: localProvider };

    User.findOne.mockResolvedValueOnce(newUser);
    shareController.createAvatar.mockReturnValueOnce(avatar);
    authHelper.encryptPassword.mockResolvedValueOnce(testHashPassword);

    await authController.signup(req, res, next);

    expect(authHelper.updateUserAndAuth).toHaveBeenCalled();
    expect(authHelper.updateUserAndAuth).toHaveBeenLastCalledWith(
      { id: userId, ...userInfo },
      authInfo
    );
  });

  test("should generate random token for email validation", async () => {
    const newUser = { id: testID };
    req = {
      body: {
        password: testPassword,
        confirmPassword: testPassword,
        email: testEmail,
      },
    };
    authHelper.createUserAndAuth.mockResolvedValueOnce(newUser);

    await authController.signup(req, res, next);

    expect(authHelper.generateRandomCrypto).toHaveBeenCalled();
  });

  test("should create a token include user information", async () => {
    const newUser = { id: testID };
    req = {
      body: {
        password: testPassword,
        confirmPassword: testPassword,
        email: testEmail,
      },
    };
    authHelper.createUserAndAuth.mockResolvedValueOnce(newUser);
    authHelper.generateRandomCrypto.mockImplementationOnce(() => token);

    await authController.signup(req, res, next);

    expect(authHelper.createEmailValidationToken).toHaveBeenLastCalledWith({
      uid: testID,
      token,
    });
  });

  test("should update email validation token", async () => {
    const newUser = { id: testID };
    req = {
      body: {
        password: testPassword,
        confirmPassword: testPassword,
        email: testEmail,
      },
    };
    authHelper.createUserAndAuth.mockResolvedValueOnce(newUser);
    authHelper.createEmailValidationToken.mockImplementationOnce(
      () => verifyToken
    );

    await authController.signup(req, res, next);

    expect(authHelper.updateEmailCheckToken).toHaveBeenLastCalledWith(
      newUser.id,
      verifyToken
    );
  });

  test("should instantiate Email by email and name", async () => {
    const newUser = { id: 1 };
    req = {
      protocol: "https",
      body: {
        name: "Tom",
        password: testPassword,
        confirmPassword: testPassword,
        email: testEmail,
      },
      get(input) {
        if (input === "host") return testHost;
      },
    };
    const sendWelcome = vi.fn(async () => {});
    const host = `${req.protocol}://${req.get("host")}/api/v1`;
    authHelper.createUserAndAuth.mockResolvedValueOnce(newUser);
    authHelper.createEmailValidationToken.mockImplementationOnce(
      () => verifyToken
    );
    Email.mockImplementationOnce(() => ({
      sendWelcome,
    }));

    await authController.signup(req, res, next);

    expect(Email).toHaveBeenLastCalledWith(req.body.email, req.body.name);
    expect(sendWelcome).toHaveBeenLastCalledWith(host, verifyToken);
  });

  test("should throw error if sending email fail", async () => {
    const newUser = { id: 1 };
    req = {
      protocol: "https",
      body: {
        name: "Tom",
        password: testPassword,
        confirmPassword: testPassword,
        email: testEmail,
      },
      get(input) {
        if (input === "host") return testHost;
      },
    };
    const sendWelcome = vi.fn(async () => {
      throw new Error();
    });
    authHelper.createUserAndAuth.mockResolvedValueOnce(newUser);
    authHelper.generateRandomCrypto.mockImplementationOnce();
    Email.mockImplementationOnce(() => ({
      sendWelcome,
    }));

    await authController.signup(req, res, next);
    error = next.mock.calls[0][0];

    expect(error).toEqual(errorTable.sendEmailError());
  });

  test("should throw error if sending email fail", async () => {
    const newUser = { id: 1 };
    req = {
      protocol: "https",
      body: {
        name: "Tom",
        password: testPassword,
        confirmPassword: testPassword,
        email: testEmail,
      },
      get(input) {
        if (input === "host") return testHost;
      },
    };
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    const sendWelcome = vi.fn(async () => {});
    authHelper.createUserAndAuth.mockResolvedValueOnce(newUser);
    authHelper.generateRandomCrypto.mockImplementationOnce();
    Email.mockImplementationOnce(() => ({
      sendWelcome,
    }));

    await authController.signup(req, res, next);

    expect(res.status).toHaveBeenLastCalledWith(201);
    expect(res.json).toHaveBeenLastCalledWith({
      status: "success",
      message: "Signup successfully! Please check your email!",
    });
  });
});

describe("login()", () => {
  let req, res, next, error;
  beforeAll(() => {
    next = vi.fn();
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    vi.spyOn(User, "findOne").mockImplementation(async () => {});
    vi.spyOn(Auth, "findOne").mockImplementation(async () => {});
    vi.spyOn(authHelper, "validatePassword").mockImplementation(async () => {});
    vi.spyOn(authHelper, "generateToken").mockImplementation(() => {});
    vi.spyOn(authHelper, "createTokenCookie").mockImplementation(() => {});
    vi.spyOn(helper, "getImgUrlFromS3").mockImplementation(() => {});
  });

  beforeEach(() => {
    req = {};
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should throw error if email does not exist", async () => {
    req = { body: { email: testEmail } };

    await authController.login(req, res, next);
    error = next.mock.calls[0][0];

    expect(User.findOne).toHaveBeenLastCalledWith({
      where: { email: req.body.email },
      raw: true,
      attributes: { include: ["role", "isEmailValidated"] },
    });
    expect(error).toEqual(errorTable.emailNotFoundError());
  });

  test("should throw error if user does not have password information.", async () => {
    req = { body: { email: testEmail } };
    User.findOne.mockResolvedValueOnce({ id: testID });
    Auth.findOne.mockResolvedValueOnce(false);

    await authController.login(req, res, next);
    error = next.mock.calls[0][0];

    expect(Auth.findOne).toHaveBeenLastCalledWith({
      where: { provider: localProvider, UserId: testID },
      raw: true,
    });
    expect(error).toEqual(errorTable.accountAuthNotFingError(localProvider));
  });

  test("should throw error if user does not validate email", async () => {
    req = { body: { email: testEmail } };
    User.findOne.mockResolvedValueOnce({ id: 1, isEmailValidated: false });
    Auth.findOne.mockResolvedValueOnce(true);

    await authController.login(req, res, next);
    error = next.mock.calls[0][0];

    expect(error).toEqual(errorTable.emailNotValidatedError());
  });

  test("should verify password by password from request and encrypt password from database", async () => {
    req = { body: { email: testEmail, password: testPassword } };
    User.findOne.mockResolvedValueOnce({ id: testID, isEmailValidated: true });
    Auth.findOne.mockImplementationOnce(async () => ({
      password: testHashPassword,
    }));

    await authController.login(req, res, next);

    expect(authHelper.validatePassword).toHaveBeenLastCalledWith(
      req.body.password,
      testHashPassword
    );
  });

  test("should generate token by user id and email", async () => {
    const userInfo = {
      id: testID,
      email: testEmail,
      isEmailValidated: true,
    };
    req = { body: { email: testEmail, password: testPassword } };
    User.findOne.mockResolvedValueOnce(userInfo);
    Auth.findOne.mockImplementationOnce(async () => ({
      password: testHashPassword,
    }));

    await authController.login(req, res, next);

    expect(authHelper.generateToken).toHaveBeenLastCalledWith(
      userInfo.id,
      userInfo.email
    );
  });

  test("should create cookie by req, res, token", async () => {
    const userInfo = {
      id: 1,
      email: testEmail,
      avatar,
      isEmailValidated: true,
    };
    req = { body: { email: testEmail, password: testPassword } };
    User.findOne.mockResolvedValueOnce(userInfo);
    Auth.findOne.mockImplementationOnce(async () => ({
      password: testHashPassword,
    }));
    authHelper.generateToken.mockImplementationOnce(() => token);

    await authController.login(req, res, next);

    expect(authHelper.createTokenCookie).toHaveBeenLastCalledWith(
      req,
      res,
      token
    );
  });

  test("should response if login successfully", async () => {
    const userInfo = {
      id: testID,
      name: "Tom",
      avatar,
      role,
      isEmailValidated: true,
    };
    req = { body: { email: testEmail, password: testPassword } };
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    User.findOne.mockResolvedValueOnce(userInfo);
    Auth.findOne.mockImplementationOnce(async () => ({
      password: testHashPassword,
    }));
    authHelper.generateToken.mockImplementationOnce(() => token);

    await authController.login(req, res, next);

    expect(res.status).toHaveBeenLastCalledWith(200);
    expect(res.json).toHaveBeenLastCalledWith({
      status: "success",
      message: "Login successfully",
      token,
      data: {
        id: userInfo.id,
        name: userInfo.name,
        role: userInfo.role,
        avatar: userInfo.avatar,
      },
    });
  });
});

describe("forgotPassword()", () => {
  let req, res, next, error;

  beforeAll(() => {
    next = vi.fn();
    vi.spyOn(User, "findOne").mockImplementation(async () => {});
    vi.spyOn(authHelper, "generateRandomPassword").mockImplementation(() => {});
    vi.spyOn(authHelper, "encryptPassword").mockImplementation(async () => {});
    vi.spyOn(authHelper, "updateUserAndAuth").mockImplementation(
      async () => {}
    );
  });

  beforeEach(() => {
    req = {};
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should throw error if user not find by his email", async () => {
    req = { body: { email: testEmail } };

    await authController.forgotPassword(req, res, next);
    error = next.mock.calls[0][0];

    expect(User.findOne).toHaveBeenLastCalledWith({
      where: { email: req.body.email },
      attributes: { include: ["email"] },
      raw: true,
    });
    expect(error).toEqual(errorTable.emailNotFoundError());
  });

  test("should generate new password", async () => {
    const randomPassword = "testRandomPassword";
    req = { body: { email: testEmail } };
    User.findOne.mockImplementationOnce(async () => true);
    authHelper.generateRandomPassword.mockImplementationOnce(
      () => randomPassword
    );

    await authController.forgotPassword(req, res, next);

    expect(authHelper.generateRandomPassword).toHaveBeenLastCalledWith(12);
    expect(authHelper.encryptPassword).toHaveBeenLastCalledWith(randomPassword);
  });

  test("should update new password to database", async () => {
    const userInfo = {
      id: testID,
    };
    const testUpdateUserInfo = { id: testID, isEmailValidated: true };
    const testUpdateAuthInfo = {
      password: testHashPassword,
      provider: localProvider,
    };
    req = { body: { email: testEmail } };
    User.findOne.mockImplementationOnce(async () => userInfo);
    authHelper.generateRandomPassword.mockImplementationOnce(
      () => testRandomPassword
    );
    authHelper.encryptPassword.mockImplementationOnce(
      async () => testHashPassword
    );

    await authController.forgotPassword(req, res, next);

    expect(authHelper.updateUserAndAuth).toHaveBeenLastCalledWith(
      testUpdateUserInfo,
      testUpdateAuthInfo
    );
  });

  test("should send new password to user email", async () => {
    const send = vi.fn(async () => {});
    req = { body: { email: testEmail } };
    const userInfo = {
      id: testID,
      name: "Tom",
      email: testEmail,
    };
    const message =
      `<p>Your new password is</p>` + `<h2>${testRandomPassword}</h2>`;
    authHelper.generateRandomPassword.mockImplementationOnce(
      () => testRandomPassword
    );
    User.findOne.mockImplementationOnce(async () => userInfo);
    Email.mockImplementationOnce(() => ({
      send,
    }));

    await authController.forgotPassword(req, res, next);

    expect(Email).toHaveBeenLastCalledWith(userInfo.email, userInfo.name);
    expect(send).toHaveBeenLastCalledWith("Reset Password", message);
  });

  test("should throw error if send email fail", async () => {
    const send = vi.fn(async () => {
      throw new Error();
    });
    req = { body: { email: testEmail } };
    const userInfo = {
      id: testID,
      name: "Tom",
      email: testEmail,
    };
    User.findOne.mockImplementationOnce(async () => userInfo);
    Email.mockImplementationOnce(() => ({
      send,
    }));

    await authController.forgotPassword(req, res, next);
    error = next.mock.calls[0][0];

    expect(error).toEqual(errorTable.sendEmailError());
  });

  test("should response if reset password successfully", async () => {
    const send = vi.fn(async () => {});
    req = { body: { email: testEmail } };
    const userInfo = {
      id: testID,
      name: "Tom",
      email: testEmail,
    };
    const randomPassword = "testRandomPassword";
    authHelper.generateRandomPassword.mockImplementationOnce(
      () => randomPassword
    );
    User.findOne.mockImplementationOnce(async () => userInfo);
    Email.mockImplementationOnce(() => ({
      send,
    }));

    await authController.forgotPassword(req, res, next);

    expect(res.status).toHaveBeenLastCalledWith(200);
    expect(res.json).toHaveBeenLastCalledWith({
      status: "success",
      message:
        "Reset password successfully, New password has sent to your email!",
    });
  });
});

describe("updatePassword()", () => {
  let req, res, next, error;

  beforeAll(() => {
    next = vi.fn();
    vi.spyOn(User, "findOne").mockImplementation(async () => {});
    vi.spyOn(authHelper, "confirmPasswordConsistency").mockImplementation(
      async () => {}
    );
    vi.spyOn(authHelper, "identifyAuth").mockImplementation(async () => {});
    vi.spyOn(authHelper, "encryptPassword").mockImplementation(async () => {});
    vi.spyOn(authHelper, "updatePassword").mockImplementation(async () => {});
  });

  beforeEach(() => {
    req = {};
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should throw error if user not find by his id", async () => {
    req = { user: { id: testID } };

    await authController.updatePassword(req, res, next);
    error = next.mock.calls[0][0];

    expect(User.findOne).toHaveBeenLastCalledWith({
      where: { id: req.user.id },
      raw: true,
    });
    expect(error).toEqual(errorTable.userNotExistError());
  });

  test("should throw error if password and confriim password are not same", async () => {
    req = {
      user: { id: testID },
      body: {
        newPassword: testNewPassword,
        confirmNewPassword: testNewPassword,
      },
    };
    User.findOne.mockImplementationOnce(async () => true);

    await authController.updatePassword(req, res, next);

    expect(authHelper.confirmPasswordConsistency).toHaveBeenLastCalledWith(
      req.body.newPassword,
      req.body.confirmNewPassword
    );
  });

  test("should throw error if verify password fail", async () => {
    req = {
      user: { id: testID },
      body: {
        password: testPassword,
        newPassword: testNewPassword,
        confirmNewPassword: testNewPassword,
      },
    };
    User.findOne.mockImplementationOnce(async () => ({ id: testID }));

    await authController.updatePassword(req, res, next);

    expect(authHelper.identifyAuth).toHaveBeenLastCalledWith({
      UserId: testID,
      provider: localProvider,
      password: testPassword,
    });
  });

  test("should encrypt password", async () => {
    req = {
      user: { id: testID },
      body: {
        password: testPassword,
        newPassword: testNewPassword,
        confirmNewPassword: testNewPassword,
      },
    };
    User.findOne.mockImplementationOnce(async () => ({ id: testID }));

    await authController.updatePassword(req, res, next);

    expect(authHelper.encryptPassword).toHaveBeenLastCalledWith(
      testNewPassword
    );
  });

  test("should update password", async () => {
    req = {
      user: { id: testID },
      body: {
        password: testPassword,
        newPassword: testNewPassword,
        confirmNewPassword: testNewPassword,
      },
    };
    User.findOne.mockImplementationOnce(async () => ({ id: testID }));
    authHelper.encryptPassword.mockImplementationOnce(
      async () => testHashPassword
    );
    await authController.updatePassword(req, res, next);

    expect(authHelper.updatePassword).toHaveBeenLastCalledWith({
      UserId: testID,
      provider: localProvider,
      password: testHashPassword,
    });
  });

  test("should response if update password successfully!", async () => {
    req = {
      user: { id: testID },
      body: {
        password: testPassword,
        newPassword: testNewPassword,
        confirmNewPassword: testNewPassword,
      },
    };
    User.findOne.mockImplementationOnce(async () => ({ id: testID }));
    authHelper.encryptPassword.mockImplementationOnce(
      async () => testHashPassword
    );
    await authController.updatePassword(req, res, next);

    expect(res.status).toHaveBeenLastCalledWith(201);
    expect(res.json).toHaveBeenLastCalledWith({
      status: "success",
      message: "Update password successfully",
    });
  });
});

describe("verifyEmail()", () => {
  let req, res, next, error;

  beforeAll(() => {
    next = vi.fn();
    vi.spyOn(jwt, "verify").mockImplementation(() => {});
    vi.spyOn(authHelper, "checkEmailValidationToken").mockImplementation(
      async () => {}
    );
    vi.spyOn(authHelper, "updateUserAndAuth").mockImplementation(
      async () => {}
    );
  });

  beforeEach(() => {
    req = {};
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    delete process.env.JWT_KEY;
    vi.clearAllMocks();
  });

  afterAll(() => {
    delete process.env.JWT_KEY;
    vi.restoreAllMocks();
  });

  test("should verify json web token", async () => {
    process.env.JWT_KEY = "TEST_JWT_KEY";
    req = { params: token };

    await authController.verifyEmail(req, res, next);

    expect(jwt.verify).toHaveBeenLastCalledWith(
      req.params.token,
      process.env.JWT_KEY
    );
  });

  test("should check email validation token", async () => {
    req = { params: token };
    jwt.verify.mockImplementationOnce(() => ({ uid: testID }));

    await authController.verifyEmail(req, res, next);

    expect(authHelper.checkEmailValidationToken).toHaveBeenLastCalledWith({
      UserId: testID,
      token: req.params.token,
      provider: localProvider,
    });
  });

  test("should update user status to email has been validted and delete the email validated token.", async () => {
    req = { params: token };
    jwt.verify.mockImplementationOnce(() => ({ uid: testID }));
    const updateUser = { id: testID, isEmailValidated: true };
    const updateAuth = { token: "", provider: localProvider };

    await authController.verifyEmail(req, res, next);

    expect(authHelper.updateUserAndAuth).toHaveBeenLastCalledWith(
      updateUser,
      updateAuth
    );
  });

  test("should response if update password successfully!", async () => {
    req = { params: token };
    jwt.verify.mockImplementationOnce(() => ({ uid: testID }));

    await authController.verifyEmail(req, res, next);

    expect(res.status).toHaveBeenLastCalledWith(200);
    expect(res.json).toHaveBeenLastCalledWith({
      status: "success",
      message: "Verify email successfully",
    });
  });
});
