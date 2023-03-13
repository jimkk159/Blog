import pool from "./index.js";
import queryConnection from "./connection.js";

const query = async (statement, values) =>
  queryConnection.query(pool, statement, values);

const getOne = async (table, col, val) =>
  queryConnection.getOne(pool, table, col, val);

//Get One by multi-condition
const getOneMulti = async (table, cols, vals) =>
  queryConnection.getOneMulti(pool, table, cols, vals);

const getMany = async (table, col, vals) =>
  queryConnection.getMany(pool, table, col, vals);

const getAll = async (table, queryString, fields) =>
  queryConnection.getAll(pool, table, queryString, fields);

const createOne = async (table, columns, values, isIgnore) =>
  queryConnection.createOne(pool, table, columns, values, isIgnore);

const updateOne = async (table, updateCols, cols, vals) =>
  queryConnection.updateOne(pool, table, updateCols, cols, vals);

export const deleteOne = async (table, cols, vals) =>
  queryConnection.deleteOne(pool, table, cols, vals);

export default {
  query,
  getOne,
  getOneMulti,
  getMany,
  getAll,
  createOne,
  updateOne,
  deleteOne,
};
