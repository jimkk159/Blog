import mysql_pool from "../index.js";

export const getDBTopics = async () => {
  const [topics] = await mysql_pool.query("SELECT * FROM `topic`");
  return topics;
};

//-----------------id---------------------
export const getDBTopic = async (id) => {
  const [topics] = await mysql_pool.query(
    "SELECT * FROM `topic` WHERE `id` = ?",
    [id]
  );
  return topics[0];
};

export const getDBParent = async (id) => {
  const topic = await getDBTopic(id);
  const parent = await getDBTopic(topic.parent_id);
  return parent;
};

export const getDBChildren = async (id) => {
  const [topics] = await mysql_pool.query(
    "SELECT * FROM `topic` WHERE `parent_id` = ?",
    [id]
  );
  return topics;
};

//-----------------name---------------------
export const getDBTopicByName = async (name) => {
  const [topics] = await mysql_pool.query(
    "SELECT * FROM `topic` WHERE `topic` = ?",
    [name]
  );
  return topics[0];
};

export const getDBParentByName = async (name) => {
  const topic = await getDBTopicByName(name);
  const parent = await getDBTopic(topic.parent_id);
  return parent;
};

export const getDBChildrenByName = async (name) => {
  const parent = await getDBTopicByName(name);
  const [topics] = await mysql_pool.query(
    "SELECT * FROM `topic` WHERE `parent_id` = ?",
    [parent.id]
  );
  return topics;
};

export const getDBRelationByName = async (name) => {
  const topic = await getDBTopicByName(name);
  const parent = await getDBTopic(topic.parent_id);
  return [topic, parent];
};