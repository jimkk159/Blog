import apiFeatures from "../../utils/api-features.js";
import { id_ } from "../../utils/table.js";

const query = async (connection, statement, values) => {
  const [result] = await connection.query(statement, values);
  return result;
};

const getOne = async (connection, table, col, val) => {
  const [result] = await connection.query(
    `SELECT * FROM ${table} WHERE ${col}= ?;`,
    [val]
  );
  return result[0];
};

//Get One by multi-condition
const getOneMulti = async (connection, table, cols, vals) => {
  let conditions = cols.map((col) => `${col}= ?`).join(" AND ");
  let queryString = `SELECT * FROM ${table} WHERE ${conditions};`;
  const [result] = await connection.query(queryString, vals);
  return result[0];
};

const getMany = async (connection, table, col, vals, select) => {
  const [result] = await connection.query(
    `SELECT ${select ?? "*"} FROM ${table} WHERE ${col} IN (?)`,
    [vals]
  );
  return result;
};

const getAll = async (connection, table, queryString, fields) => {
  const features = new apiFeatures.getAllFeatures(table, queryString)
    .filter()
    .sort()
    .limitFields(fields)
    .paginate();

  const [result] = await connection.query(features.query, features.values);
  return result;
};

const createOne = async (
  connection,
  table,
  columns,
  values,
  isIgnore = false
) => {
  const ignore = isIgnore ? "IGNORE " : "";
  const questionMarks = Array(values.length).fill("?").join(",");
  const [result] = await connection.query(
    `INSERT ${ignore}INTO ${table}(${columns.join(
      ","
    )}) VALUES (${questionMarks});`,
    values
  );
  return result.insertId;
};

const updateOne = (connection, table, statements, values) =>
  connection.query(`UPDATE ${table} SET ${statements} WHERE ${id_}= ?;`, [
    ...values,
  ]);

const updateAll = async (connection, table, queryObj, col, vals) => {
  const [statements, values] = Object.entries(queryObj).reduce(
    ([q, v], [key, value]) => {
      q.push(`${key} = ?`);
      v.push(value);
      return [q, v];
    },
    [[], []]
  );
  const statement = statements.join(" , ");
  return await connection.query(
    `UPDATE ${table} SET ${statement} WHERE ${col} IN (?);`,
    [...values, vals]
  );
};

export const deleteOne = (connection, table, id) =>
  connection.query(`DELETE FROM ${table} WHERE ${id_}= ?;`, [id]);

const startTransaction = async (connection, func) => {
  let result;
  try {
    await connection.beginTransaction();
    result = await func();
    await connection.commit();
    connection.release();
  } catch (err) {
    await connection.rollback();
    connection.release();
    return err;
  }
  return result;
};

export default {
  query,
  getOne,
  getOneMulti,
  getMany,
  getAll,
  createOne,
  updateOne,
  updateAll,
  deleteOne,
  startTransaction,
};
