import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../../config/app";
import User from "../../module/user";
import * as authHelper from "../../utils/helper/auth-helper";

vi.mock("jsonwebtoken");

const myId = "1";
const localProvider = "local";
const rootUser = "root";
describe("/api/v1/users", () => {
  const token = { uid: myId, provider: localProvider };
  const decodeToken = { uid: 1 };

  beforeAll(() => {
    vi.spyOn(User, "create").mockImplementation(async () => {});
    vi.spyOn(User, "findByPk").mockImplementation(async () => {});
    vi.spyOn(User, "findAndCountAll").mockImplementation(async () => {});
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
    test("should get users data", async () => {
      const query = "age[gte]=30&sort=-name&limit=-name&page=3&limit=100";
      const testData = {
        count: 2,
        rows: [
          { id: 1, role: "user", name: "Tom", age: 31 },
          { id: 2, role: "user", name: "Bob", age: 45 },
        ],
      };
      const root = { id: myId, role: rootUser, isEmailValidated: true };

      User.findByPk.mockResolvedValueOnce(root);
      User.findAndCountAll.mockImplementationOnce(async () => testData);

      const response = await request(app)
        .get(`/api/v1/users?${query}`)
        .set("Authorization", "Bearer " + token)
        .set("Accept", "application/json");

      expect(User.findAndCountAll).toHaveBeenLastCalledWith({
        where: { age: { [Op.gte]: "30" } },
        order: [["name", "DESC"]],
        limit: 100,
        offset: 200,
      });
      expect(response.status).toBe(200);
      expect(response.type).toBe("application/json");
      expect(response.body).toEqual({
        status: "success",
        count: testData.count,
        data: testData.rows,
      });
    });
  });

  describe("POST", () => {
    test("should throw  error if validation fail", async () => {
      const root = { id: myId, role: rootUser, isEmailValidated: true };
      User.findByPk.mockResolvedValueOnce(root);

      const response = await request(app)
        .post(`/api/v1/users`)
        .set("Authorization", "Bearer " + token)
        .set("Accept", "application/json");

      expect(response.status).toBe(422);
      expect(response.type).toBe("application/json");
      expect(response.body.status).toBe("fail");
      expect(response.body.message).toBe(
        "Invalid inputs, please check your input is correct."
      );
    });

    test("should throw  error if validation fail", async () => {
      const updateData = {
        name: "Tom",
        email: "test@gmail.com",
        password: "123456",
        confirmPassword: "123456",
      };
      const testdata = {
        test: "TestData",
        updatedAt: "updatedAt",
        createdAt: "createdAt",
      };
      const root = { id: myId, role: rootUser, isEmailValidated: true };
      User.findByPk.mockResolvedValueOnce(root);
      User.create.mockResolvedValueOnce({
        toJSON() {
          return testdata;
        },
      });

      const response = await request(app)
        .post(`/api/v1/users`)
        .send(updateData)
        .set("Authorization", "Bearer " + token)
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.type).toBe("application/json");
      expect(response.body.status).toBe("success");
      expect(response.body.data).toEqual({
        test: "TestData",
      });
    });
  });
});
