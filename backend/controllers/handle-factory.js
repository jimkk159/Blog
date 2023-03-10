import queryPool from "../module/mysql/pool.js";
import HttpError from "../utils/http-error.js";
import catchAsync from "../utils/catch-async.js";

const getOne = (table) =>
  catchAsync(async (req, res, next) => {
    const data = await queryPool.getOne(table, "id", req.params.id);

    if (!data) {
      return next(new HttpError(`No data found with that ID.`, 404));
    }
    res.locals.response = {
      status: "success",
      data,
    };
    if(!res.locals.skipNext) next();
  });

const getAll = (table, fields) =>
  catchAsync(async (req, res, next) => {
    const data = await queryPool.getAll(
      `${table}`,
      req.query,
      fields?.map((element) => `${element}`)
    );
    res.locals.response = {
      status: "success",
      results: data.length,
      data: { data },
    };
    if(!res.locals.skipNext) next();
  });

const createOne = (table) =>
  catchAsync(async (req, res, next) => {
    const columns = Object.keys(req.body);
    const values = Object.values(req.body);

    const insertId = await queryPool.createOne(table, columns, values);
    const data = await queryPool.getOne(table, "id", insertId);

    res.locals.response = {
      status: "success",
      data: {
        data,
      },
    };
    if(!res.locals.skipNext) next();
  });

const updateOne = (table) =>
  catchAsync(async (req, res, next) => {
    const statements = `\`${Object.keys(req.body)
      .map((key) => `${key}\` = ?`)
      .join(", `")}`;
    const values = Object.values(req.body);
    await queryPool.updateOne(table, statements, [...values, req.params.id]);
    const data = await queryPool.getOne(table, "id", req.params.id);
    if (!data) {
      return next(new HttpError("No data found with that ID", 404));
    }

    res.locals.response = {
      status: "success",
      data: {
        data,
      },
    };
    if(!res.locals.skipNext) next();
  });

const deleteOne = (table) =>
  catchAsync(async (req, res, next) => {
    await queryPool.deleteOne(table, req.params.id);
    if(!res.locals.skipNext) res.status(204).json();
  });

export default { getOne, getAll, createOne, updateOne, deleteOne };
