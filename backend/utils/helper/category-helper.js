import Category from "../../module/category.js";
import * as helper from "../helper/helper.js";
import * as errorTable from "../error/errorTable.js";
import * as categoryHelper from "../helper/category-helper.js";

export const checkParentIsExist = async (id) => {
  const parent = await Category.findByPk(id);
  if (!parent) throw errorTable.parentNotFound();
};

export const checkParentIdLegality = async (ParentId) => {
  if (!helper.isNumber(ParentId)) throw errorTable.notNumberError("ParentId");
  await categoryHelper.checkParentIsExist(ParentId);
};

export const isRoot = (category) => category.name === "root";

export const getCategoryChildren = (categories, currentCategoryId) =>
  categories.filter((category) => category.ParentId === currentCategoryId);

export const checkCircularReference = (
  categories,
  currentCategoryId,
  newParentId
) => {
  // 1) circular reference happen
  if (+currentCategoryId === +newParentId) return true;

  // 2) get current category children
  const children = categoryHelper.getCategoryChildren(
    categories,
    currentCategoryId
  );

  // 3) dfs check circular reference happen on children
  if (children.length > 0)
    return children.some((child) =>
      checkCircularReference(categories, child.id, newParentId)
    );

  // 4) circular reference not happen
  return false;
};

export const checkCategoryCircularReference = async (
  currentCategoryId,
  newParentId
) => {
  const categories = await Category.findAll({});

  const result = categoryHelper.checkCircularReference(
    categories,
    currentCategoryId,
    newParentId
  );
  if (result) throw errorTable.circularReferenceHappenError();
};