import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../../config/app";
import User from "../../module/user";
import * as authHelper from "../../utils/helper/auth-helper";

vi.mock("jsonwebtoken");

const myId = "1";
const rootUser = "root";
const token = "testToken";
const normalUser = "user";
const decodeToken = { uid: myId };
describe("/api/v1/users/me", () => {
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
    test("should get user data", async () => {
      const testData = "TestData";
      const root = { id: myId, role: normalUser, isEmailValidated: true };
      User.findByPk
        .mockImplementationOnce(async (id) => {
          if (id === decodeToken.uid) return root;
          else return undefined;
        })
        .mockImplementationOnce(async (id, option) => {
          if (id === decodeToken.uid) return testData;
          else return undefined;
        });

      const response = await request(app)
        .get("/api/v1/users/me")
        .set("Authorization", "Bearer " + token)
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.type).toBe("application/json");
      expect(response.body).toEqual({
        status: "success",
        data: "TestData",
      });
    });
  });

  describe("PATCH", () => {
    test("should update user data", async () => {
      const updatedBody = { name: "updatedName", age: 25 };
      const root = {
        id: myId,
        role: normalUser,
        isEmailValidated: true,
        name: "testName",
        age: 20,
      };
      User.findByPk
        .mockImplementationOnce(async (id) => {
          if (id === decodeToken.uid) return root;
          else return undefined;
        })
        .mockImplementationOnce(async (id) => {
          if (id === decodeToken.uid) return { ...root, ...updatedBody };
          else return undefined;
        });

      const response = await request(app)
        .patch("/api/v1/users/me")
        .send(updatedBody)
        .set("Authorization", "Bearer " + token)
        .set("Accept", "application/json");

      expect(User.update).toHaveBeenLastCalledWith(updatedBody, {
        where: { id: myId },
      });
      expect(response.status).toBe(200);
      expect(response.type).toBe("application/json");
      expect(response.body).toEqual({
        status: "success",
        data: { ...root, ...updatedBody },
      });
    });
  });

  describe("DELETE", () => {
    test("should delete user", async () => {
      const root = { id: myId, role: rootUser, isEmailValidated: true };
      User.findByPk.mockImplementationOnce(async (id) => {
        if (id === decodeToken.uid) return root;
        else return undefined;
      });

      const response = await request(app)
        .delete("/api/v1/users/me")
        .set("Authorization", "Bearer " + token)
        .set("Accept", "application/json");

      expect(User.destroy).toHaveBeenLastCalledWith({ where: { id: myId } });
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
  });
});
