import * as helper from "./helper.js";
import * as upload from "../aws/s3.js";

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

export const commandToS3Avatar = async (array, command) =>
  Promise.all(
    array.map(async (el) => {
      if (
        el.avatar &&
        !(el.avatar.startsWith("https://") || el.avatar.startsWith("http://"))
      ) {
        el.avatar = await command(el.avatar);
      }
    })
  );

export const getImgUrlFromS3 = async (array) =>
  Promise.all([commandToS3Avatar(array, upload.getFileFromS3)]);

export const deleteImgFromS3 = async (array) =>
  Promise.all([commandToS3Avatar(array, upload.deleteFileFromS3)]);
