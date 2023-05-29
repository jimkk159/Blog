import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../../config/app";
import User from "../../module/user";
import * as authHelper from "../../utils/helper/auth-helper";

vi.mock("jsonwebtoken");

const myId = "1";
const targetId = "2";
const rootUser = "root";
describe("/api/v1/users/:id", () => {
  const token = "testToken";
  const decodeToken = { uid: 1 };

  beforeAll(() => {
    vi.spyOn(User, "findByPk").mockImplementation(async () => {});
    vi.spyOn(User, "update").mockImplementation(async () => {});
    vi.spyOn(User, "destroy").mockImplementation(async () => {});
    vi.spyOn(authHelper, "isTokenLegal").mockImplementation(async () => true);
    jwt.verify.mockImplementation(() => decodeToken);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe("GET", () => {
    test("should get user data if user is existed", async () => {
      const testData = "TestData";
      const root = { id: myId, role: rootUser, isEmailValidated: true };

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
      expect(response.body).toEqual({
        status: "success",
        data: testData,
      });
    });
  });

  describe("PATCH", () => {
    test("should update user", async () => {
      const testData = "TestData";
      const testBody = { name: "testName", age: 30 };
      const root = { id: myId, role: rootUser, isEmailValidated: true };

      User.findByPk
        .mockResolvedValueOnce(root)
        .mockImplementationOnce(async (id, option) => {
          if (id === targetId) return testData;
          else return undefined;
        });

      const response = await request(app)
        .patch(`/api/v1/users/${targetId}`)
        .send(testBody)
        .set("Authorization", "Bearer " + token)
        .set("Accept", "application/json");

      expect(User.update).toHaveBeenLastCalledWith(testBody, {
        where: { id: targetId },
      });
      expect(response.status).toBe(200);
      expect(response.type).toBe("application/json");
      expect(response.body).toEqual({
        status: "success",
        data: testData,
      });
    });
  });

  describe("DELETE", () => {
    test("should delete user", async () => {
      const root = { id: myId, role: rootUser, isEmailValidated: true };
      User.findByPk.mockResolvedValueOnce(root);

      const response = await request(app)
        .delete(`/api/v1/users/${targetId}`)
        .set("Authorization", "Bearer " + token)
        .set("Accept", "application/json");

      expect(User.destroy).toHaveBeenLastCalledWith({
        where: { id: targetId },
      });
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
  });
});
