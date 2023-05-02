import catchAsync from "../utils/catch-async.js";
import * as errorTable from "../utils/error/errorTable.js";
import { GetFeatures } from "../utils/api-features.js";
import * as helper from "../utils/helper/helper.js";

export const getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const data = await Model.findByPk(req.params.id, {
      raw: true,
    });
    if (!data) throw errorTable.idNotFoundError();

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

    const data = await getFeature.findAll();
    setTimeout(() => {
      res.status(200).json({
        status: "success",
        count: data.count,
        data: data.rows,
      });
    }, 2000);
  });

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let data = await Model.create(req.body);
    data = helper.removeExclude(data.toJSON(), ["updatedAt", "createdAt"]);

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
    await Model.destroy({ where: { id: req.params.id } });
    res.status(204).json();
  });
