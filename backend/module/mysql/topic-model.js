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

    // 1) Create topic
    insertId = await queryConnection.createOne(
      connection,
      topic_,
      [topic_name_, parent_id_],
      [topic, parent_id]
    );

    // 2) Update child to this topic
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
  return queryPool.getOne(topic_, [id_], [insertId]);
};

const deleteOneTopic = async (id) => {
  const topic = await queryPool.getOne(topic_, [id_], [+id]);
  // 1) Topic not exist, not need to delete
  if (!topic) return;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 2) Update child to this parent of this topic
    await queryConnection.updateAll(
      connection,
      topic_,
      { parent_id: topic.parent_id },
      parent_id_,
      [topic.id]
    );

    // 3) Delete topic
    await queryConnection.deleteOne(connection, topic_, [id_], [topic.id]);
    await connection.commit();
    connection.release();
  } catch (err) {
    await connection.rollback();
    connection.release();
    throw new Error(err);
  }
};

export default {
  createOneTopic,
  deleteOneTopic,
};
