import * as helper from "./helper.js";
import * as errorTable from "../error/error-table.js"

export const isTagIdLegal = (tagId) =>
  helper.isNumber(tagId) || Array.isArray(tagId);

export const checkTagsConsistency = (tags, tagIds) => {
  if (helper.isNumber(tagIds) && !tags.length) throw errorTable.tagNotExistError();
  if (Array.isArray(tagIds) && tags.length !== tagIds.length)
    throw errorTable.tagNotExistError();
};