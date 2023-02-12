import mysql_pool from "../index.js";
import { getDBTopic } from "../topic/read.js";

//-----------------Topic---------------------
export const createDBTopic = async ({ topic, parent_id, children }) => {
  const connection = await mysql_pool.getConnection();

  let result;
  try {
    await connection.beginTransaction();
    [result] = await connection.query(
      "INSERT INTO `topic`(`topic`, `parent_id`) VALUES (?, ?);",
      [topic, parent_id]
    );
    await Promise.all(
      children.map(async (child) => {
        await connection.query(
          "UPDATE `topic` SET `parent_id`=? WHERE `id`= ?",
          [result.insertId, child]
        );
      })
    );
    await connection.commit();
    connection.release();
  } catch (err) {
    await connection.rollback();
    connection.release();
    throw new Error(err);
  }
  return getDBTopic(result.insertId);
};
