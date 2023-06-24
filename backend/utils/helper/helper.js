import he from "he";
import validator from "validator";

import * as helper from "./helper.js";
import * as upload from "../aws/s3.js";
import * as apiFeatureHelper from "../helper/api-feature-helper.js";

export const isURL = (input) =>
  !!(input && (input.startsWith("https://") || input.startsWith("http://")));

export const toNaturalNumber = (input) => {
  let num = parseInt(input);
  if (isNaN(num) || num < 1) {
    return 0;
  }
  return num;
};

export const isObject = (input) =>
  typeof input === "object" && !Array.isArray(input) && input !== null;

export const isIncludeID = (obj) =>
  Object.keys(obj)
    .map((el) => {
      if (typeof el !== "string") return el;
      return el.toLocaleLowerCase();
    })
    .includes("id");

export const keepKeys = (obj, keysToKeep) =>
  Object.keys(obj)
    .filter((key) => keysToKeep.includes(key))
    .reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {});

export const removeKeys = (obj, keysToRemove) =>
  Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => !keysToRemove.includes(key))
  );

export const isExpired = (expire_in) =>
  !(expire_in && new Date(expire_in) > new Date());

export const isNumber = (id) =>
  !!id && !helper.isObject(id) && !Array.isArray(id) && !isNaN(id);

export const deepClone = (obj) => {
  if (typeof obj !== "object" || obj === null) return obj;

  // Create an array or obj to hold the values
  const newObject = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    const value = obj[key];
    newObject[key] = deepClone(value);
  }

  return newObject;
};

export const commandToS3Avatar = async (file, command) => {
  if (file && !isURL(file)) return command(file);
  return file;
};

// export const getAvatarUrlFromS3 = async (file) =>
//   commandToS3Avatar(file, upload.getFileFromS3);

export const deleteAvatarUrlFromS3 = async (file) =>
  helper.commandToS3Avatar(file, upload.deleteFileFromS3);

export const getAvatarsUrlFromS3 = (data) =>
  data.map((el) => {
    if (el.avatar) el.avatar = helper.getImgUrlFromS3(el.avatar);
  });

// export const getImgUrlFromS3 = async (file) => upload.getFileFromS3(file);

export const deleteImgUrlFromS3 = async (file) => upload.deleteFileFromS3(file);

export const getImgUrlFromS3 = (file) =>
  "https://jimkk159-blog-img.s3.ap-northeast-1.amazonaws.com/" + file;

export const modifySyntax = (input) => he.decode(input);

export const modeifiedSyntax = (input) =>
  input ? helper.modifySyntax(input) : undefined;

export const modifySort = (sort, target) => {
  if (!sort) return `-${target}`;
  if (sort && !sort.includes(target))
    return [target, ...apiFeatureHelper.getQueryElements(sort)].join(",");
  return sort;
};

export const setDefault = (query, target, isNegative = true, join = ",") => {
  const defaultTarget = !!isNegative ? "-" + target : target;
  if (!query) return defaultTarget;
  if (query.includes(target)) return query;
  return [query, defaultTarget].join(join);
};

export const isImgURL = (img) => !!(img && validator.isURL(img));
