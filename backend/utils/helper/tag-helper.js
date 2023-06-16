import * as helper from "./helper.js";
import * as errorTable from "../error/error-table.js"

export const isTagIdLegal = (tagIds) =>
  helper.isNumber(tagIds) || Array.isArray(tagIds);

export const checkTagsConsistency = (tags, tagIds) => {
  if (helper.isNumber(tagIds) && !tags.length) throw errorTable.tagNotExistError();
  if (Array.isArray(tagIds) && tags.length !== tagIds.length)
    throw errorTable.tagNotExistError();
};