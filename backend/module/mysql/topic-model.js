import pool from "./index.js";
import queryPool from "./pool.js";
import queryConnection from "./connection.js";
import { id_, topic_, parent_id_, topic_name_ } from "../../utils/table.js";

//-----------------Topic---------------------
const createOneTopic = async ({ topic, parent_id, children }) => {
  const connection = await pool.getConnection();
  let insertId;
  try {
    await connection.beginTransaction();
    insertId = await queryConnection.createOne(
      connection,
      topic_,
      [topic_name_, parent_id_],
      [topic, parent_id]
    );
    if (!!children.length)
      await queryConnection.updateAll(
        connection,
        topic_,
        { parent_id: insertId },
        id_,
        children
      );
    await connection.commit();
    connection.release();
  } catch (err) {
    await connection.rollback();
    connection.release();
    throw new Error(err);
  }
  return queryPool.getOne(topic_, id_, insertId);
};

export default {
  createOneTopic,
};
