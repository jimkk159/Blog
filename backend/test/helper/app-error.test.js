import AppError from "../../utils/error/app-error";

describe("AppError", () => {
  test.each(["Error1", "Error2"])(
    "should has error message if error message is provided",
    (message) => {
      const appError = new AppError(message, 400);
      expect(appError.message).toBe(message);
    }
  );
  
  test.each([
    ["Error1", 100],
    ["Error2", 200],
    ["Error3", 300],
  ])(
    "should has property if it instantiated",
    (errorMessage, errorStatusCode) => {
      const appError = new AppError(errorMessage, errorStatusCode);
      expect(appError.status).toBe("unknown status");
      expect(appError.statusCode).toBe(errorStatusCode);
      expect(appError.message).toBe(errorMessage);
      expect(appError.isOperational).toBe(true);
    }
  );

  test.each([
    ["Error1", 400],
    ["Error2", 401],
  ])(
    "should has fail status if http code is 4xx",
    (errorMessage, errorStatusCode) => {
      const appError = new AppError(errorMessage, errorStatusCode);
      expect(appError.status).toBe("fail");
      expect(appError.statusCode).toBe(errorStatusCode);
      expect(appError.message).toBe(errorMessage);
      expect(appError.isOperational).toBe(true);
    }
  );

  test.each([
    ["Error1", 500],
    ["Error2", 501],
  ])(
    "should has error status if http code is 5xx",
    (errorMessage, errorStatusCode) => {
      const appError = new AppError(errorMessage, errorStatusCode);
      expect(appError.status).toBe("error");
      expect(appError.statusCode).toBe(errorStatusCode);
      expect(appError.message).toBe(errorMessage);
      expect(appError.isOperational).toBe(true);
    }
  );
});
