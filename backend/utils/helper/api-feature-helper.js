import { Op } from "sequelize";
import * as helper from "./helper.js";
import * as errorTable from "../error/error-table.js";
import * as apiFeatureHelperhelper from "./api-feature-helper.js";

import Tag from "../../module/tag.js";
import User from "../../module/user.js";
import Post from "../../module/post.js";
import Comment from "../../module/comment.js";
import Category from "../../module/category.js";

const fieldsToModelTable = {
  Author: {
    model: User,
    as: "Author",
    attributes: {
      exclude: [
        "description",
        "email",
        "role",
        "createdAt",
        "updatedAt",
        "updatePasswordAt",
        "isEmailValidated",
      ],
    },
  },
  AuthorId: {
    model: User,
    as: "Author",
    attributes: {
      exclude: [
        "description",
        "email",
        "role",
        "createdAt",
        "updatedAt",
        "updatePasswordAt",
        "isEmailValidated",
      ],
    },
  },
  Post: { model: Post },
  Posts: { model: Post },
  PostId: { model: Post },
  PostIds: { model: Post },
  Category: { model: Category },
  Categories: { model: Category },
  CategoryId: { model: Category },
  CategoryIds: { model: Category },
  Comment: { model: Comment },
  Comments: { model: Comment },
  CommentId: { model: Comment },
  CommentIds: { model: Comment },
  Tag: { model: Tag, through: { attributes: [] } },
  Tags: { model: Tag, through: { attributes: [] } },
};

export const createModelByFields = () => {};

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

export const toFirstWordCapitalize = (input) => {
  if (input.length > 1) return input.slice(0, 1).toUpperCase() + input.slice(1);
  if (input.length > 0) return input.slice(0, 1).toUpperCase();
  return input;
};

export const createPopulateObj = (query) => {
  if (!query) return null;

  const fields = query.split(".");

  let populateObj = null;
  for (let i = fields.length - 1; i >= 0; i--) {
    const field = fields[i];

    const populateOptions = {
      ...fieldsToModelTable[
        apiFeatureHelperhelper.toFirstWordCapitalize(field)
      ],
    };

    if (!populateOptions) throw errorTable.populateFailError([query]);
    if (populateObj) populateOptions.include = populateObj;
    populateObj = populateOptions;
  }
  return populateObj;
};

export const createPopulateObjs = (query) => {
  if (!query) return;

  const createdPopObjs = query.split(",").map((el) => {
    const output = apiFeatureHelperhelper.createPopulateObj(el);
    return output;
  });

  return {
    include: createdPopObjs,
  };
};
