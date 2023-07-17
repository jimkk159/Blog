import Post from "../module/post.js";
import Category from "../module/category.js";
import sequelize from "../config/db-init.js";
import catchAsync from "../utils/error/catch-async.js";
import * as helper from "../utils/helper/helper.js";
import * as errorTable from "../utils/error/error-table.js";
import * as cacheHelper from "../utils/helper/cache-helper.js";
import * as categoryHelper from "../utils/helper/category-helper.js";

export const createOne = catchAsync(async (req, res, next) => {
  // 1) check ParentId
  if (!helper.isNumber(req.body.ParentId))
    throw errorTable.notNumberError("ParentId");
  await categoryHelper.checkParentIsExist(req.body.ParentId);

  // 2) create category
  let data = await Category.create({
    ParentId: req.body.ParentId,
    name: helper.modeifiedSyntax(req.body.name),
  });
  if (!data) throw errorTable.categoryAlreadyExistError();
  data = helper.removeKeys(data.toJSON(), ["updatedAt", "createdAt"]);

  // 3) remove remain cache
  await cacheHelper.delKey(req.originalUrl);

  res.status(200).json({
    status: "success",
    data,
  });
});

export const updateOne = catchAsync(async (req, res, next) => {
  // 1) check ParentId
  if (req.body.ParentId)
    await categoryHelper.checkParentIdLegality(req.body.ParentId);

  // 2) check target category legality
  const category = await Category.findByPk(req.params.id);
  if (!category) throw errorTable.categoryNotFound();
  if (categoryHelper.isRoot(category))
    throw errorTable.notAllowUpdateRootError();

  // 3) check circular reference
  if (req.body.ParentId) {
    await categoryHelper.checkCategoryCircularReference(
      category.id,
      req.body.ParentId
    );
  }

  // 4) update category ParentId
  await Category.update(
    {
      name: helper.modeifiedSyntax(req.body.name),
      ParentId: req.body.ParentId,
    },
    { where: { id: req.params.id } }
  );

  // 5) return new categories list to user
  const categorires = await Category.findAll();

  // 6) remove remain cache
  await cacheHelper.delCache(req.originalUrl);

  res.status(200).json({
    status: "success",
    data: categorires,
  });
});

export const deleteOne = catchAsync(async (req, res, next) => {
  // 1) check category exist
  const category = await Category.findByPk(req.params.id);
  if (!category) throw errorTable.categoryNotFound();

  // 2) check target category legality
  if (categoryHelper.isRoot(category))
    throw errorTable.notAllowDeleteRootError();

  await sequelize.transaction(async (t) => {
    await Category.update(
      { ParentId: category.ParentId },
      {
        where: { ParentId: req.params.id },
        transaction: t,
      }
    );
    await Post.update(
      { CategoryId: category.ParentId },
      {
        where: { CategoryId: req.params.id },
        transaction: t,
      }
    );

    await Category.destroy({ where: { id: req.params.id }, transaction: t });
  });

  await cacheHelper.delCache(req.originalUrl);

  res.status(204).json();
});
