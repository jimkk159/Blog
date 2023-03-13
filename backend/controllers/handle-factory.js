import queryPool from "../module/mysql/pool.js";
import HttpError from "../utils/http-error.js";
import catchAsync from "../utils/catch-async.js";
import { id_ } from "../utils/table.js";

const getOne = (table) =>
  catchAsync(async (req, res, next) => {
    const data = await queryPool.getOne(table, [id_], [req.params.id]);

    if (!data) {
      return next(new HttpError(`No data found with that ID.`, 404));
    }
    res.status(200).json({
      status: "success",
      data,
    });
  });

const getAll = (table, fields) =>
  catchAsync(async (req, res, next) => {
    const data = await queryPool.getAll(
      `${table}`,
      req.query,
      fields?.map((element) => `${element}`)
    );
    res.status(200).json({
      status: "success",
      results: data.length,
      data,
    });
  });

const createOne = (table) =>
  catchAsync(async (req, res, next) => {
    const columns = Object.keys(req.body);
    const values = Object.values(req.body);

    const insertId = await queryPool.createOne(table, columns, values);
    const data = await queryPool.getOne(table, [id_], [insertId]);

    res.status(200).json({
      status: "success",
      data,
    });
  });

const updateOne = (table) =>
  catchAsync(async (req, res, next) => {
    if (Object.keys(req.body).includes("id"))
      return next(new HttpError("No Allow to update ID", 404));

    const statements = `\`${Object.keys(req.body)
      .map((key) => `${key}\` = ?`)
      .join(", `")}`;

    const values = Object.values(req.body);
    await queryPool.updateOne(
      table,
      statements,
      [id_],
      [...values, req.params.id]
    );
    const data = await queryPool.getOne(table, [id_], [req.params.id]);
    if (!data) {
      return next(new HttpError("No data found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data,
    });
  });

const deleteOne = (table) =>
  catchAsync(async (req, res, next) => {
    await queryPool.deleteOne(table, [id_], [req.params.id]);
    if (!res.locals.skipNext) res.status(204).json();
  });

export default { getOne, getAll, createOne, updateOne, deleteOne };
