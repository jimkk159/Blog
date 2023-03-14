import queryPool from "../module/mysql/pool.js";
import HttpError from "../utils/http-error.js";
import catchAsync from "../utils/catch-async.js";
import { id_ } from "../utils/table.js";

const getOne = (table) =>
  catchAsync(async (req, res, next) => {
    const data = await queryPool.getOne(table, [id_], [req.params.id]);
    // No data reutrn error
    if (!data) return next(new HttpError(`No data found with that ID.`, 404));

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
    // 1) Parse req body
    const cols = Object.keys(req.body);
    const vals = Object.values(req.body);

    // 2) Create new to database
    const insertId = await queryPool.createOne(table, cols, vals);

    // 3) Get the new from database
    const data = await queryPool.getOne(table, [id_], [insertId]);

    res.status(200).json({
      status: "success",
      data,
    });
  });

const updateOne = (table) =>
  catchAsync(async (req, res, next) => {
    // 1) id(primary key) is not allow to update
    if (Object.keys(req.body).includes("id"))
      return next(new HttpError("No Allow to update ID", 404));

    // 2) Update to database
    await queryPool.updateOne(
      table,
      Object.keys(req.body),
      [id_],
      [...Object.values(req.body), req.params.id]
    );

    // 3) Get the update from database
    const data = await queryPool.getOne(table, [id_], [req.params.id]);
    if (!data) return next(new HttpError("No data found with that ID", 404));

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
