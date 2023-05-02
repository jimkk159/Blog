import gravatar from "gravatar";
import normalize from "normalize-path";
import { validationResult } from "express-validator";
import * as errorTable from "../utils/error/errorTable.js";
import * as shareController from "./share-controller.js";

// Validate the req
export const validation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw errorTable.validateError();
  next();
};

// Generate Avatar URI
export const isFilePath = (file) => !!(file && file.path);

export const createGravatar = (email) =>
  gravatar.url(email, {
    protocol: "https",
    d: "identicon",
  });

export const createAvatar = (email, file) => {
  if (isFilePath(file)) return normalize(file.path);
  else return shareController.createGravatar(email);
};

//reference: https://stackoverflow.com/questions/72336177/error-reqlogout-requires-a-callback-function
