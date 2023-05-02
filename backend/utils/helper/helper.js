import * as helper from "./helper.js"

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

export const removeExclude = (obj, exclude) => {
  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    if (exclude.includes(key)) continue;
    newObj[key] = value;
  }
  return newObj;
};

export const isExpired = (expire_in) =>
  !(expire_in && new Date(expire_in) > new Date());

export const isNumber = (id) => !!id && !helper.isObject(id) && !Array.isArray(id) && !isNaN(id);
