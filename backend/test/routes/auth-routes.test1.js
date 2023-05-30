import jwt from "jsonwebtoken";
import app from "../../config/app";
import request from "supertest";
import User from "../../module/user";
import * as authHelper from "../../utils/helper/auth-helper";

vi.mock("jsonwebtoken");

const targetId = "2";
describe("authUserByToken()", () => {
  const token = "testToken";
  const decodeToken = { uid: 1 };

  beforeAll(() => {
    vi.spyOn(User, "findByPk").mockImplementation(async () => {});
    vi.spyOn(authHelper, "isUserLegal").mockImplementation(() => {});
    vi.spyOn(authHelper, "isTokenLegal").mockImplementation(async () => {});
    jwt.verify.mockImplementation(() => decodeToken);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should not get user data if authentication fail", async () => {
    const response = await request(app)
      .get(`/api/v1/users/${targetId}`)
      .set("Authorization", "Bearer ")
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.status).toBe("fail");
    expect(response.body.message).toBe("Authentication failed!");
  });

  test("should throw error if user not find", async () => {
    const rootUser = undefined;
    User.findByPk.mockResolvedValueOnce(rootUser);

    const response = await request(app)
      .get(`/api/v1/users/${targetId}`)
      .set("Authorization", "Bearer " + token)
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.type).toBe("application/json");
    expect(response.body.status).toBe("fail");
    expect(response.body.message).toBe(
      "User not exists, singup an account first."
    );
  });

  test("should throw error if user is illegal", async () => {
    const user = {};
    User.findByPk.mockResolvedValueOnce(user);
    authHelper.isUserLegal.mockImplementationOnce(() => false);

    const response = await request(app)
      .get(`/api/v1/users/${targetId}`)
      .set("Authorization", "Bearer " + token)
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.status).toBe("fail");
    expect(response.body.message).toBe("Authentication failed!");
  });

  test("should throw error if token is illegal", async () => {
    const user = {};
    User.findByPk.mockResolvedValueOnce(user);
    authHelper.isUserLegal.mockImplementationOnce(() => true);
    authHelper.isTokenLegal.mockImplementationOnce(() => false);

    const response = await request(app)
      .get(`/api/v1/users/${targetId}`)
      .set("Authorization", "Bearer " + token)
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.status).toBe("fail");
    expect(response.body.message).toBe("Authentication failed!");
  });
});

describe("restrictTo()", () => {
  const token = "testToken";
  const decodeToken = { uid: 1 };

  beforeAll(() => {
    vi.spyOn(User, "findByPk");
    vi.spyOn(authHelper, "isTokenLegal").mockImplementation(async () => true);
    jwt.verify.mockImplementation(() => decodeToken);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should pass if user role is in roles", async () => {
    const testData = "TestData";
    const root = { role: "root", isEmailValidated: true };
    User.findByPk
      .mockResolvedValueOnce(root)
      .mockImplementationOnce(async (id, option) => {
        if (id === targetId) return testData;
        else return undefined;
      });

    const response = await request(app)
      .get(`/api/v1/users/${targetId}`)
      .set("Authorization", "Bearer " + token)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.type).toBe("application/json");
    expect(response.body.status).toBe("success");
    expect(response.body).toEqual({
      status: "success",
      data: testData,
    });
  });

  test("should not pass if user role is in roles", async () => {
    const testData = "TestData";
    const normalUser = { role: "user", isEmailValidated: true };
    User.findByPk
      .mockResolvedValueOnce(normalUser)
      .mockImplementationOnce(async (id, option) => {
        if (id === targetId) return testData;
        else return undefined;
      });

    const response = await request(app)
      .get(`/api/v1/users/${targetId}`)
      .set("Authorization", "Bearer " + token)
      .set("Accept", "application/json");

    expect(response.status).toBe(403);
    expect(response.type).toBe("application/json");
    expect(response.body.status).toBe("fail");
    expect(response.body.message).toBe("Permission deny");
  });
});
