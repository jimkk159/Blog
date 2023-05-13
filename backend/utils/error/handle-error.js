import fs from "fs";
import { isSqlError, createCustomSqlError } from "./custom-error.js";

// ------------------Dev Error------------------
export const sendDevError = (err, res) => {
  console.log(err)
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// ----------------Product Error------------------
export const isOperationaleError = (err) => err.isOperational;

//Operational, trusted error: send message
export const handleOperationalError = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

// Programming or other unknown error: don't leak error details
export const handleUnknownError = (err, res) => {
  console.log("Error!", err);
  return res.status(500).json({
    status: "error",
    message: "An unknown error occurred...",
  });
};

export const sendProductError = (err, res) => {
  if (!isOperationaleError(err)) return handleUnknownError(err, res);
  handleOperationalError(err, res);
};

// ----------------Error Boundary------------------
export const removeFileWhenError = (req, err) =>
  fs.unlink(req.file.path, (err) => {
    console.log(`Delete file ${req.file.path}...`);
  });

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  
  // 1) Remove file
  if (req.file) removeFileWhenError(req, err);

  // 2) Send error in dev
  if (process.env.APP_ENV === "dev") {
    // console.log("Error Happen!!", err);
    sendDevError(err, res);

  } else if (process.env.APP_ENV === "prod") {
    // 3) Send error in production mode
    let error = { ...err };
    error.message = err.message;

    //Predictable Error
    if (isSqlError(error)) error = createCustomSqlError(error);
    sendProductError(error, res);
  }
};
