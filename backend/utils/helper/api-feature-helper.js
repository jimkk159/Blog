import { Op } from "sequelize";
import * as helper from "./helper.js";

export const isOnlyOperator = (obj) => {
  if (!helper.isObject(obj))
    throw new TypeError("Input object must be an object");
  return Object.keys(obj).length === 1;
};

export const isOperatorInTable = (obj, table) => {
  if (!Array.isArray(table))
    throw new TypeError("Input table must be an array");
  return table.includes(Object.keys(obj)[0]);
};

export const getOperator = (obj) => Object.keys(obj)[0];

export const sanitizeFilterObj = (queryObj, allowOperators) => {
  const newOptObj = {};
  for (const key of Object.keys(queryObj)) {
    const optObj = { ...queryObj[key] };
    if (!helper.isObject(optObj)) continue;
    if (!isOnlyOperator(optObj)) continue;
    if (!isOperatorInTable(optObj, allowOperators)) continue;
    const operator = getOperator(optObj);
    newOptObj[key] = { [operator]: optObj[operator] };
  }
  return newOptObj;
};

export const getQueryItemShouldIn = (query) => {
  const queryObj = {};
  for (const [key, value] of Object.entries(query)) {
    if (!Array.isArray(value)) continue;
    queryObj[key] = value;
  }
  return queryObj;
};

export const getQueryItemEqualTo = (query) => {
  const queryObj = {};
  for (const [key, value] of Object.entries(query)) {
    if (!(typeof value === "string")) continue;
    queryObj[key] = value;
  }
  return queryObj;
};

export const getQueryElements = (string) => string.split(",");

export const replaceOperator = (operator, obj) => ({
  [Op[operator]]: obj[operator],
});

export const replaceFilterOperators = (queryObj) => {
  for (const key of Object.keys(queryObj)) {
    const optObj = { ...queryObj[key] };
    const operator = getOperator(optObj);
    queryObj[key] = replaceOperator(operator, queryObj[key]);
  }
  return queryObj;
};

export const createSequelizeSort = (sortArray) =>
  sortArray.map((el) => {
    if (el.startsWith("-")) return [el.slice(1), "DESC"];
    else return [el, "ASC"];
  });

export const createSequelizeAttributes = (fields) =>
  fields.filter((el) => !el.startsWith("-"));

export const createSequelizeExclude = (fields) =>
  fields.filter((el) => el.startsWith("-")).map((el) => el.slice(1));
