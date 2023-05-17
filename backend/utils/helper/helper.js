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

export const deepClone = (input) => JSON.parse(JSON.stringify(input));

export const commandToS3Avatar = async (file, command) => {
  if (file && !(file.startsWith("https://") || file.startsWith("http://"))) {
    return command(file);
  }
  return file;
};

export const getAvatarUrlFromS3 = async (file) =>
  commandToS3Avatar(file, upload.getFileFromS3);

export const deleteAvatarUrlFromS3 = async (file) =>
  commandToS3Avatar(file, upload.deleteFileFromS3);

export const setAvatarsUrlFromS3 = async (data) =>
  Promise.all(
    data.map(async (el) => {
      if (el.avatar) el.avatar = await helper.getAvatarUrlFromS3(el.avatar);
    })
  );
