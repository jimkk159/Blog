class AppError extends Error {
  constructor(message, statusCode) {
    super(message); //Add a "message" property
    this.statusCode = statusCode;
    //Http Error Code 4xx: client error, 5xx: server error
    this.status = `${statusCode}`.startsWith("4")
      ? "fail"
      : `${statusCode}`.startsWith("5")
      ? "error"
      : "unknown status";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
