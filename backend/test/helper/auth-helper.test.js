import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../module/user";
import Auth from "../../module/auth";
import * as authHelper from "../../utils/helper/auth-helper";
import * as errorTable from "../../utils/error/error-table";
import { afterAll, beforeAll, beforeEach, describe } from "vitest";

const testID = 1;
const localProvider = "local";
const token = "testToken";
const testPassword = "testPassword";
const testWrongPassword = "testWrongPassword";
const testHashPassword =
  "$2a$12$CJvYQqp95a8EtXc8e4Ptv.ji.xZovj2rBaURZb3LmV/1C7v3oDcse";
const testSecure = "testSecure";
const testAuth = {
  UserId: testID,
  provider: localProvider,
  password: testPassword,
  token,
};

vi.useFakeTimers();
vi.setSystemTime(new Date(1998, 11, 19));
describe("isHearderAuthorization()", () => {
  test("should return true if hearder has authorization", () => {
    const headers = { authorization: "test" };
    expect(authHelper.isHearderAuthorization(headers)).toBe(true);
  });

  test("should return false if hearder has not authorization", () => {
    const headers = {};
    expect(authHelper.isHearderAuthorization(headers)).toBe(false);
  });
});

describe("isLocal()", () => {
  test("should return true if provider is local", () => {
    expect(authHelper.isLocal("local")).toBe(true);
  });

  test.each(["test", "google"])(
    "should return false if provider is foreign",
    (provider) => {
      expect(authHelper.isLocal(provider)).toBe(false);
    }
  );
});

describe("isUserLegal()", () => {
  test("should return false if user not exist", () => {
    const user = undefined,
      provider = "test";
    expect(authHelper.isUserLegal(user, provider)).toBe(false);
  });

  test("should return true if it is not local user", () => {
    const user = {},
      provider = "test";
    expect(authHelper.isUserLegal(user, provider)).toBe(true);
  });

  test("should return true if it is local user and have been validated his email", () => {
    const user = { isEmailValidated: true },
      provider = localProvider;
    expect(authHelper.isUserLegal(user, provider)).toBe(true);
  });

  test.each([{}, { isEmailValidated: false }])(
    "should return false if it is local user and doesn't validated his email",
    (user) => {
      const provider = localProvider;
      expect(authHelper.isUserLegal(user, provider)).toBe(false);
    }
  );
});

describe("isTokenLegal()", () => {
  beforeAll(() => {
    vi.spyOn(Auth, "findOne").mockImplementation(async () => {});
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should return false if token is created before password updated", async () => {
    const decodeToken = { uid: testID, provider: localProvider, iat: 0 };
    Auth.findOne.mockResolvedValueOnce({ updatedAt: 1000 });

    const result = await authHelper.isTokenLegal(decodeToken);

    expect(Auth.findOne).toHaveBeenLastCalledWith({
      where: { UserId: decodeToken.uid, provider: decodeToken.provider },
    });
    expect(result).toBe(false);
  });

  test("should return true if token is created after password updated", async () => {
    const decodeToken = { uid: testID, provider: localProvider, iat: 1000 };
    Auth.findOne.mockResolvedValueOnce({ updatedAt: 0 });

    const result = await authHelper.isTokenLegal(decodeToken);

    expect(Auth.findOne).toHaveBeenLastCalledWith({
      where: { UserId: decodeToken.uid, provider: decodeToken.provider },
    });
    expect(result).toBe(true);
  });
});

describe("generateRandomPassword()", () => {
  test.each([4, 8])(
    "should match the password length if provided",
    (length) => {
      const password = authHelper.generateRandomPassword(length);
      expect(password).toHaveLength(length);
    }
  );
  
  test("should password be string", (length) => {
    const password = authHelper.generateRandomPassword(2);
    expectTypeOf(password).toBeString();
  });

  test("should password not be same if generated", (length) => {
    const password_A = authHelper.generateRandomPassword(4);
    const password_B = authHelper.generateRandomPassword(4);
    expect(password_A).not.toEqual(password_B);
  });
});

describe("isPasswordConsistent()", () => {
  test("should be true if password and confirmPassword are same", () => {
    const result = authHelper.isPasswordConsistent(testPassword, testPassword);
    expect(result).toBe(true);
  });

  test("should be false if password and confirmPassword are not same", () => {
    const result = authHelper.isPasswordConsistent(
      testPassword,
      testWrongPassword
    );
    expect(result).toBe(false);
  });
});

describe("confirmPasswordConsistency()", () => {
  let error;

  beforeEach(() => {
    error = undefined;
  });
  test("should throw error if password and confirmPassword are not same", () => {
    try {
      authHelper.confirmPasswordConsistency(testPassword, testWrongPassword);
    } catch (err) {
      error = err;
    }

    expect(error).toEqual(errorTable.passwordNotMatchError());
  });

  test("should not throw error if password and confirmPassword are same", () => {
    try {
      authHelper.confirmPasswordConsistency(testPassword, testPassword);
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
  });
});

describe("encryptPassword()", () => {
  let error;
  beforeAll(() => {
    vi.spyOn(bcrypt, "hash");
  });

  afterEach(() => {
    error = undefined;
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should throw error if an error occur", async () => {
    bcrypt.hash.mockRejectedValueOnce(new Error());
    try {
      await authHelper.encryptPassword(testPassword);
    } catch (err) {
      error = err;
    }

    expect(error).toEqual(errorTable.encryptPasswordError());
  });

  test("should not equal if password encrypt", async () => {
    let result;
    try {
      result = await authHelper.encryptPassword(testPassword);
    } catch (err) {}
    expect(result).not.toBe(testPassword);
    expect(result).not.toBeUndefined();
  });
});

describe("validatePassword()", () => {
  let error;

  beforeAll(() => {
    vi.spyOn(bcrypt, "compare");
  });

  beforeEach(() => {
    error = undefined;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should throw error if an error occur", async () => {
    bcrypt.compare.mockRejectedValueOnce(new Error());
    try {
      await authHelper.validatePassword(testPassword);
    } catch (err) {
      error = err;
    }

    expect(error).toEqual(errorTable.validatePasswordError());
  });

  test("should throw error if password is not match", async () => {
    let error;
    try {
      await authHelper.validatePassword(testPassword, testWrongPassword);
    } catch (err) {
      error = err;
    }

    expect(error).toEqual(errorTable.wrongPasswordError());
  });

  test("should not throw error if password match", async () => {
    try {
      await authHelper.validatePassword(testPassword, testHashPassword);
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
  });
});

describe("createEmailValidationToken()", () => {
  beforeAll(() => {
    vi.spyOn(jwt, "sign").mockImplementation(() => {});
  });

  beforeEach(() => {
    process.env.JWT_KEY = "";
    vi.clearAllMocks();
  });

  afterAll(() => {
    delete process.env.JWT_KEY;
    vi.restoreAllMocks();
  });

  test("should throw error if password match", () => {
    let result;
    const uid = testID;
    process.env.JWT_KEY = "TEST_JWT_KEY";
    jwt.sign.mockImplementationOnce(() => "jwt_test");

    try {
      result = authHelper.createEmailValidationToken({ uid, token });
    } catch (err) {
      error = err;
    }

    expect(jwt.sign).toHaveBeenLastCalledWith(
      { uid, token },
      process.env.JWT_KEY,
      { expiresIn: 15 * 60 }
    );
    expect(result).toBe("jwt_test");
  });
});

describe("generateToken()", () => {
  let error;

  beforeAll(() => {
    vi.spyOn(jwt, "sign");
  });

  beforeEach(() => {
    error = undefined;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should throw error if password match", () => {
    jwt.sign.mockImplementationOnce(() => {
      throw new Error();
    });

    try {
      authHelper.generateToken();
    } catch (err) {
      error = err;
    }

    expect(error).toEqual(errorTable.generateAuthTokenError());
  });
});

describe("createTokenCookie()", () => {
  let req, res;
  beforeEach(() => {
    req = {};
    res = {};
  });

  afterAll(() => {
    delete process.env.JWT_EXPIRES_IN;
  });

  test("should update token to cookie", () => {
    req = { secure: testSecure };
    res = { cookie: vi.fn() };
    process.env.JWT_EXPIRES_IN = 10;

    authHelper.createTokenCookie(req, res, token);

    expect(res.cookie).toHaveBeenLastCalledWith("token", token, {
      expires: new Date(
        Date.now() + process.env.JWT_EXPIRES_IN * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: req.secure,
    });
  });
});

describe("updateEmailCheckToken()", () => {
  beforeAll(() => {
    vi.spyOn(Auth, "update");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should update Auth by user id and token", async () => {
    Auth.update.mockResolvedValueOnce();

    await authHelper.updateEmailCheckToken(testID, token);

    expect(Auth.update).toHaveBeenLastCalledWith(
      { token: token },
      { where: { UserId: testID, provider: localProvider } }
    );
  });
});

describe("updateUserAndAuth()", () => {
  beforeAll(() => {
    vi.spyOn(Auth, "update");
    vi.spyOn(User, "update");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should update Auth by user id and token", async () => {
    const userInfo = { id: 1, name: "Test", role: "user" };
    const updateUserInfo = { name: "Test", role: "user" };
    const authInfo = { password: testPassword, provider: localProvider };
    const updateAuthInfo = { password: testPassword };
    Auth.update.mockResolvedValueOnce();
    User.update.mockResolvedValueOnce();

    await authHelper.updateUserAndAuth(userInfo, authInfo);

    expect(User.update.mock.calls[0][0]).toEqual(updateUserInfo);
    expect(User.update.mock.calls[0][1].where).toEqual({ id: userInfo.id });
    expect(Auth.update.mock.calls[0][0]).toEqual(updateAuthInfo);
    expect(Auth.update.mock.calls[0][1].where).toEqual({
      UserId: userInfo.id,
      provider: authInfo.provider,
    });
  });
});

describe("createUserAndAuth()", () => {
  beforeAll(() => {
    vi.spyOn(Auth, "create");
    vi.spyOn(User, "create");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should update Auth by user id and token", async () => {
    const userID = 1;
    const userInfo = { name: "Test", role: "user" };
    const createUserResult = { id: userID, ...userInfo };
    const authInfo = { password: testPassword, provider: localProvider };
    Auth.create.mockResolvedValueOnce();
    User.create.mockImplementationOnce(async () => createUserResult);

    const result = await authHelper.createUserAndAuth(userInfo, authInfo);

    expect(User.create.mock.calls[0][0]).toEqual(userInfo);
    expect(Auth.create.mock.calls[0][0]).toEqual({
      UserId: userID,
      ...authInfo,
    });
    expect(result).toBe(createUserResult);
  });
});

describe("identifyAuth()", () => {
  let error;
  beforeAll(() => {
    vi.spyOn(Auth, "findOne");
    vi.spyOn(authHelper, "validatePassword");
  });

  afterEach(() => {
    error = undefined;
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should throw error if auth information is not exist.", async () => {
    Auth.findOne.mockResolvedValueOnce();

    await authHelper.identifyAuth(testAuth).catch((err) => (error = err));

    expect(error).toEqual(errorTable.accountAuthNotFingError(localProvider));
  });

  test("should has property if identify password successfully.", async () => {
    Auth.findOne.mockResolvedValueOnce({
      expire_in: new Date("5000-01-01"),
      password: testHashPassword,
    });

    await authHelper.identifyAuth(testAuth).catch((err) => (error = err));

    expect(error).toBeUndefined();
    expect(Auth.findOne).toHaveBeenLastCalledWith({
      where: { UserId: testAuth.UserId, provider: testAuth.provider },
      raw: true,
    });
    expect(authHelper.validatePassword).toHaveBeenLastCalledWith(
      testAuth.password,
      testHashPassword
    );
  });
});

describe("updatePassword()", () => {
  let error;
  beforeAll(() => {
    vi.spyOn(authHelper, "updateUserAndAuth").mockImplementation(() => {});
  });

  beforeEach(() => {
    error = undefined;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should has property if update password.", async () => {
    await authHelper.updatePassword(testAuth).catch((err) => (error = err));

    expect(error).toBeUndefined();
    expect(authHelper.updateUserAndAuth).toHaveBeenLastCalledWith(
      { id: testAuth.UserId, updatePasswordAt: Date.now() },
      { password: testAuth.password, provider: testAuth.provider }
    );
  });
});

describe("isSameToken()", () => {
  test("should return true if token is same", () => {
    expect(authHelper.isSameToken(token, token)).toBe(true);
  });

  test("should return false if token is same", () => {
    const anotherToken = "anotherToken";
    expect(authHelper.isSameToken(token, anotherToken)).toBe(false);
  });
});

describe("checkEmailValidationToken()", () => {
  let error;

  beforeAll(() => {
    vi.spyOn(Auth, "findOne");
  });

  beforeEach(() => {
    error = undefined;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should throw error if email validation token is not correct.", async () => {
    Auth.findOne.mockResolvedValueOnce({ token: "" });

    await authHelper.checkEmailValidationToken(testAuth).catch((err) => {
      error = err;
    });

    expect(error).toEqual(errorTable.emailTokenVerifyError());
  });

  test("should has property if email validate successfully!", async () => {
    Auth.findOne.mockResolvedValueOnce({ token: testAuth.token });

    await authHelper.checkEmailValidationToken(testAuth).catch((err) => {
      error = err;
    });

    expect(error).toBeUndefined();
    expect(Auth.findOne).toHaveBeenLastCalledWith({
      where: { UserId: testAuth.UserId, provider: testAuth.provider },
    });
  });
});
