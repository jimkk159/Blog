import HttpError from "./http-error.js";
import queryPool from "../module/mysql/pool.js";
import queryConnection from "../module/mysql/connection.js";
import { topic_, id_, topic_name_, parent_id_ } from "../utils/table.js";

const checkTopic = (topic) => {
  if (!topic) throw new HttpError("Topic is null!", 403);

  if (topic.toLowerCase() === "root")
    throw new HttpError("Not allow to set Root for Topic.", 422);
};

const isValidParentChildRelation = async (parent, child) => {
  const childTopic = await queryPool.getOne(topic_, [topic_name_], [child]);
  if (!childTopic) return false;
  const parentTopic = await queryPool.getOne(
    topic_,
    [id_],
    [childTopic.parent_id]
  );
  if (!parentTopic) return false;
  if (parent !== parentTopic.name) return false;
  return true;
};

// Recursive checking the grandsons of this id
const getDescendantIds = async (id) => {
  const rows = await queryPool.query(
    `WITH RECURSIVE cte AS ` +
      `(` +
      `SELECT ${id_} FROM ${topic_} WHERE ${id_} = ? ` +
      `UNION ALL ` +
      `SELECT t.${id_} FROM cte ` +
      `JOIN ${topic_} t ON cte.${id_} = t.${parent_id_}` +
      `) ` +
      `SELECT ${id_} FROM cte WHERE ${id_} != ?`,
    [id, id]
  );
  return rows.map((element) => element.id);
};

// checking the circular reference
const checkCircularReference = async (id, parentId) => {
  // checking the grandsons of this id
  const ids = await getDescendantIds(id);
  ids.push(id);

  // Checking the parentId if include current parentId
  return ids.includes(parentId);
};

const isLegalRelatedTopic = async (queryTopic, queryParent, queryChildren) => {
  //Check Topic Property
  const topic = await queryPool.getOne(topic_, [topic_name_], [queryTopic]);
  const parent = await queryPool.getOne(topic_, [topic_name_], [queryParent]);
  let children = [];
  if (Array.isArray(queryChildren)) {
    children = [
      ...new Set(queryChildren.map((element) => element.toLowerCase())),
    ];
  } else if (queryChildren) {
    children = [queryChildren.toLowerCase()];
  }

  // Parent Not Exist-----------------------
  if (!parent)
    return {
      valid: false,
      status: 404,
      message: "Topic Parent not found!",
    };

  // Parent not match Parent-----------------------
  if (topic && !(await isValidParentChildRelation(queryParent, queryTopic)))
    return {
      valid: false,
      status: 422,
      message: "Parent does not match!",
    };
  // Children not match -----------------------
  const checkParent = topic ? queryTopic : queryParent;
  if (
    children.length &&
    !(
      await Promise.all(
        children.map((child) => isValidParentChildRelation(checkParent, child))
      )
    ).every((element) => element)
  )
    return {
      valid: false,
      status: 422,
      message: "Children does not match!",
    };

  if (topic) {
    return { valid: true, exist: true, ...topic, children };
  }

  // Get Children Ids
  if (children.length)
    children = (
      await queryPool.getMany(topic_, topic_name_, queryChildren, id_)
    ).map((element) => element.id);

  return {
    valid: true,
    exist: false,
    topic: queryTopic,
    parent_id: parent.id,
    children,
  };
};

const identifyTopic = async (topic, parent, children) => {
  checkTopic(topic);
  const result = await isLegalRelatedTopic(topic, parent, children);
  if (!result.valid) throw new HttpError(result.message, result.status);
  return { ...result };
};

const parseTopic = async (topic, parent, children) => {
  if (
    !topic ||
    topic === "" ||
    topic === "null" ||
    topic.toLowerCase() === "root"
  )
    throw new HttpError("Invalid Topic.", 422);

  let newTopic = await isLegalRelatedTopic(topic, parent, children);

  if (!newTopic.valid) throw new HttpError(newTopic.message, newTopic.status);

  if (!newTopic.exist) {
    newTopic = await topicModel.createOneTopic({ ...result });
  }

  return newTopic;
};

export default {
  identifyTopic,
  parseTopic,
  getDescendantIds,
  checkCircularReference,
};
