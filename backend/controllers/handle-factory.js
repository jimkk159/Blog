import catchAsync from "../utils/error/catch-async.js";
import * as helper from "../utils/helper/helper.js";
import { GetFeatures } from "../utils/api-features.js";
import * as errorTable from "../utils/error/error-table.js";

export const getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const data = await Model.findByPk(req.params.id, {
      raw: true,
    });
    if (!data) throw errorTable.idNotFoundError();
    await helper.getImgUrlFromS3([data]);

    res.status(200).json({
      status: "success",
      data,
    });
  });

export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const getFeature = new GetFeatures(Model, req.query)
      .filter()
      .sort()
      .select()
      .paginate();

    const data = await getFeature.findAll({ raw: true });
    await helper.getImgUrlFromS3(data);

    res.status(200).json({
      status: "success",
      count: data.length,
      data,
    });
  });

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let data = await Model.create(req.body);
    data = helper.removeKeys(data.toJSON(), ["updatedAt", "createdAt"]);

    res.status(200).json({
      status: "success",
      data,
    });
  });

export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (helper.isIncludeID(req.body)) throw errorTable.notAllowUpdateIDError();

    await Model.update(req.body, { where: { id: req.params.id } });

    const data = await Model.findByPk(req.params.id, { raw: true });
    if (!data) throw errorTable.idNotFoundError();

    res.status(200).json({
      status: "success",
      data,
    });
  });

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const data = await Model.findByPk(req.params.id);
    if (!data) return res.status(204).json();

    // ToDo should roll back database and S3 when fail
    await helper.deleteImgFromS3([data]);

    await Model.destroy({ where: { id: req.params.id } });
    res.status(204).json();
  });
