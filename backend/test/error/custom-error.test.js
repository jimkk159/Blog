import { describe } from "vitest";
import {
  isSqlError,
  createCustomSqlError,
} from "../../utils/error/custom-error";

describe("isSqlError()", () => {
  test("should return true if error is SQL error", () => {
    const error = { name: "Sequelize_Test" };
    expect(isSqlError(error)).toBe(true);
  });

  test("should return false if error is not SQL error", () => {
    const error_A = { name: "Test_Error" };
    const error_B = {};

    expect(isSqlError(error_A)).toBe(false);
    expect(isSqlError(error_B)).toBe(false);
  });
});

describe("createCustomSqlError()", () => {
  describe("Sequelize database error", () => {
    test("should return error if error is SQL syntax error", () => {
      const syntaxError = {
        name: "SequelizeDatabaseError",
        parent: { sqlState: "42000" },
      };

      const responseError = createCustomSqlError(syntaxError);

      expect(responseError.status).toBe("fail");
      expect(responseError.statusCode).toBe(400);
      expect(responseError.isOperational).toBe(true);
      expect(responseError.message).toBe(
        "You have an error in your query syntax;"
      );
    });

    test("should return error if error is SQL fields error", () => {
      const fieldError = {
        name: "SequelizeDatabaseError",
        parent: { sqlState: "42S22" },
      };

      const responseError = createCustomSqlError(fieldError);

      expect(responseError.status).toBe("fail");
      expect(responseError.statusCode).toBe(400);
      expect(responseError.isOperational).toBe(true);
      expect(responseError.message).toBe(
        "You have an error in your query fields;"
      );
    });

    test("should return error if error is SQL TimeStamp error", () => {
      const timeStampError = {
        name: "SequelizeDatabaseError",
        parent: { sqlState: "HY000" },
      };

      const responseError = createCustomSqlError(timeStampError);

      expect(responseError.status).toBe("fail");
      expect(responseError.statusCode).toBe(422);
      expect(responseError.isOperational).toBe(true);
      expect(responseError.message).toBe(
        "You have an error in your query TimeStamp;"
      );
    });
  });

  describe("Sequelize validation error", () => {
    test("should return error if error is SQL Model validate error", () => {
      const validateError = {
        name: "SequelizeValidationError",
      };

      const responseError = createCustomSqlError(validateError);

      expect(responseError.status).toBe("fail");
      expect(responseError.statusCode).toBe(400);
      expect(responseError.isOperational).toBe(true);
      expect(responseError.message).toBe(
        "You have an error in your SQL Model validation;"
      );
    });
  });

  describe("Sequelize unique constraint error", () => {
    test("should return error if violate unique key rule", () => {
      const uniqueKeyError = {
        name: "SequelizeUniqueConstraintError",
        errors: [{ message: "Test message" }],
      };

      const responseError = createCustomSqlError(uniqueKeyError);

      expect(responseError.status).toBe("fail");
      expect(responseError.statusCode).toBe(400);
      expect(responseError.isOperational).toBe(true);
      expect(responseError.message).toBe("Test message");
    });
  });
});
