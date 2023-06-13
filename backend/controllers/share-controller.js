import gravatar from "gravatar";
import About from "../module/about.js";
import normalize from "normalize-path";
import * as s3 from "../utils/aws/s3.js";
import * as helper from "../utils/helper/helper.js";
import { validationResult } from "express-validator";
import catchAsync from "../utils/error/catch-async.js";
import * as errorTable from "../utils/error/error-table.js";
import * as shareController from "./share-controller.js";

// Validate the req
export const validation = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) throw errorTable.validateError(result.errors);
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

export const updateImage = catchAsync(async (req, res, next) => {
  let img;

  if (req.file) {
    const uploadImg = await s3.uploadToS3(req.file);
    img = helper.getImgUrlFromS3(uploadImg);
  }

  res.status(200).json({
    status: "success",
    data: {
      img,
    },
  });
});

export const createAbout = catchAsync(async (req, res) => {
  // create About
  await About.create({ content: helper.modifySyntax(req.body.content) });

  res.status(200).json({ status: "success" });
});

//reference: https://stackoverflow.com/questions/72336177/error-reqlogout-requires-a-callback-function