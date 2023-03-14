import pool from "./index.js";
import queryPool from "./pool.js";
import queryConnection from "./connection.js";
import HttpError from "../../utils/http-error.js";
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
// ToDo these topic update may cause circular reference
const updateOneTopic = async (id, queryTopic, queryParent, queryChildren) => {
  // 1) Check topic if exist
  let topic = await queryPool.getOne(topic_, [id_], [id]);
  if (!topic) throw new HttpError("Topic not found", 404);

  // 2) Check topic Name if exist
  if (queryTopic) {
    const result = await queryPool.getOne(
      topic_,
      [topic_name_],
      ["" + queryTopic]
    );
    if (result) throw new HttpError("Topic has already been exist", 400);
  }

  // 3) Check parent if exist
  let parent;
  if (queryParent) {
    parent = await queryPool.getOne(topic_, [topic_name_], [queryParent]);
    if (!parent) throw new HttpError("Parent not found", 404);
  }

  // 4) Check children if exist
  let children = [];
  let childrenIds = [];
  if (queryChildren) {
    if (Array.isArray(queryChildren)) children = [...new Set(queryChildren)];
    else if (queryChildren) children = [queryChildren];
    children = await Promise.all(
      children.map((child) => queryPool.getOne(topic_, [topic_name_], [child]))
    );
    if (!children.every((element) => !!element))
      throw new HttpError("Child not found", 404);
    childrenIds = children.map((element) => element.id);
  }

  // 5) Get the current children to this topic
  const currentChildrenIds = (
    await queryPool.getAll(topic_, {
      parent_id: id,
    })
  ).map((element) => element.id);

  // 6) Who is new child?
  const newChildren = childrenIds.filter(
    (element) => !currentChildrenIds.includes(element)
  );

  // 7) Who is orphan?
  const orphan = currentChildrenIds.filter(
    (element) => !childrenIds.includes(element)
  );

  // 8) Parse the input data
  const cols = [];
  const vals = [];
  if (queryTopic) {
    cols.push(topic_name_);
    vals.push(queryTopic);
  }
  if (queryParent) {
    cols.push(parent_id_);
    vals.push(parent.id);
  }
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    // 9) Update topic
    if (queryTopic || queryParent) {
      await queryConnection.updateOne(
        connection,
        topic_,
        cols,
        [id_],
        [...vals, id]
      );
    }

    // 10) Update child to this topic
    if (newChildren.length)
      await queryConnection.updateAll(
        connection,
        topic_,
        { parent_id: id },
        id_,
        newChildren
      );

    // 11) Update child to their grandparent
    if (orphan.length)
      await queryConnection.updateAll(
        connection,
        topic_,
        { parent_id: topic.parent_id },
        id_,
        orphan
      );

    await connection.commit();
    connection.release();
  } catch (err) {
    console.log(err);
    await connection.rollback();
    connection.release();
    throw new Error(err);
  }
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
  updateOneTopic,
  deleteOneTopic,
};
