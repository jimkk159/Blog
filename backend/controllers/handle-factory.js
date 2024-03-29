import * as helper from "../utils/helper/helper.js";
import catchAsync from "../utils/error/catch-async.js";
import { GetFeatures } from "../utils/api-features.js";
import * as errorTable from "../utils/error/error-table.js";
import * as cacheHelper from "../utils/helper/cache-helper.js";
import * as apiFeatureHelper from "../utils/helper/api-feature-helper.js";

export const getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // Get Data from DB
    const getDataFromDB = async () => {
      // 1) Create populate
      const sqlQuery = apiFeatureHelper.createPopulateObjs(req.query.pop);

      // 2) Get data
      return Model.findByPk(req.params.id, sqlQuery);
    };

    // Get Data from DB or Cache
    const data = await cacheHelper.getOrSetCache(
      req.originalUrl,
      getDataFromDB
    );
    if (!data) throw errorTable.idNotFoundError();

    res.status(200).json({
      status: "success",
      data,
    });
  });

export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // Get Data from DB
    const getDataFromDB = async () => {
      const getFeature = new GetFeatures(Model, req.query)
        .filter()
        .sort()
        .select()
        .paginate()
        .pop();

      return getFeature.findAll({ raw: true });
    };

    // Get Data from DB or Cache
    const data = await cacheHelper.getOrSetCache(
      req.originalUrl,
      getDataFromDB
    );

    res.status(200).json({
      status: "success",
      count: data.length,
      data,
    });
  });

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1) create data
    let data = await Model.create(req.body);

    // 2) remove data information
    data = helper.removeKeys(data.toJSON(), ["updatedAt", "createdAt"]);

    // 3) remove remain cache
    await cacheHelper.delKey(req.originalUrl);

    res.status(200).json({
      status: "success",
      data,
    });
  });

export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1) check if update id
    if (helper.isIncludeID(req.body)) throw errorTable.notAllowUpdateIDError();

    // 2) update data
    await Model.update(req.body, { where: { id: req.params.id } });

    // 3) get updated data
    const data = await Model.findByPk(req.params.id, { raw: true });
    if (!data) throw errorTable.idNotFoundError();

    // 4) remove remain cache
    await cacheHelper.delCache(req.originalUrl);

    res.status(200).json({
      status: "success",
      data,
    });
  });

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1) get query data
    const data = await Model.findByPk(req.params.id);
    if (!data) return res.status(204).json();

    // ToDo should roll back database and S3 when fail
    if (data.avatar && !helper.isURL(data.avatar))
      await helper.deleteAvatarUrlFromS3(data.avatar);

    // 2) delete data
    await Model.destroy({ where: { id: req.params.id } });

    // 3) remove remain cache
    await cacheHelper.delCache(req.originalUrl);

    res.status(204).json();
  });

// ------------------- Without Cache ----------------------------

export const getOneWithoutCache = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1) Create populate
    const sqlQuery = apiFeatureHelper.createPopulateObjs(req.query.pop);

    // 2) Get data
    const data = await Model.findByPk(req.params.id, sqlQuery);
    if (!data) throw errorTable.idNotFoundError();

    res.status(200).json({
      status: "success",
      data,
    });
  });
