import fs from "fs";
import HttpError from "../utils/http-error.js";

const handleDBSyntaxError = (err) => {
  const message = `You have an error in your query syntax;`;
  return new HttpError(message, 400);
};

const handleDBBadFields = (err) => {
  const message = `You have an error in your query fields;`;
  return new HttpError(message, 400);
};

const handleDBBadTimeStamp = (err) => {
  const message = `Time Format wrong!`;
  return new HttpError(message, 422);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //Operational, trusted error: send message
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.log("Error!", err);
    // 2)
    res.status(500).json({
      status: "error",
      message: "An unknown error occurred...",
    });
  }
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(`Delete file ${req.file.path}...`);
    });
  }
  if (process.env.APP_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.APP_ENV === "production") {
    let error = { ...err };
    error.message = err.message;
    //Predictable Error
    if (error.sql && error.sqlState === "42000")
      error = handleDBSyntaxError(error);
    if (error.sql && error.sqlState === "42S22")
      error = handleDBBadFields(error);
    if (error.sql && error.sqlState === "HY000")
      error = handleDBBadTimeStamp(error);
    sendErrorProd(error, res);
  }
};
