import mysql from "mysql2";

const mysql_pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

//-----------------User---------------------
export const getDBUser = async (uid) => {
  const [user] = await mysql_pool.query("SELECT * FROM `user` WHERE id = ?", [
    uid,
  ]);
  return user[0];
};

export const getDBUserByEmail = async (email) => {
  const [users] = await mysql_pool.query(
    "SELECT * FROM `user` WHERE `email`=?",
    [email]
  );
  return users[0];
};

export const getDBUsers = async () => {
  const [users] = await mysql_pool.query("SELECT * FROM `user`");
  return users;
};

export const getDBUsersIn = async (uidArray) => {
  const [users] = await mysql_pool.query(
    "SELECT * FROM `user` WHERE `id` IN (?)",
    [uidArray]
  );
  return users;
};

export const createDBUser = async ({ name, email, avatar, password }) => {
  const [users] = await mysql_pool.query(
    "INSERT INTO `user`(`name`, `email`, `avatar`, `password`) VALUES (?, ?, ?, ?)",
    [name, email, avatar, password]
  );
  return users[0];
};

//-----------------Topic---------------------
export const getDBTopic = async (id) => {
  const [topics] = await mysql_pool.query(
    "SELECT * FROM `topic` WHERE `id` = ?",
    [id]
  );
  return topics[0];
};

export const getDBTopicByName = async (name) => {
  const [topics] = await mysql_pool.query(
    "SELECT * FROM `topic` WHERE `name` = ?",
    [name]
  );
  return topics[0];
};

export const getDBTopics = async () => {
  const [topics] = await mysql_pool.query("SELECT * FROM `topic`");
  return topics;
};

export const getDBParent = async (id) => {
  const topic = await getDBTopic(id);
  const parent = await getDBTopic(topic.parent_id);
  return parent;
};

export const getDBParentByName = async (name) => {
  const topic = await getDBTopicByName(name);
  const parent = await getDBTopic(topic.parent_id);
  return parent;
};

export const getDBRelationByName = async (name) => {
  const topic = await getDBTopicByName(name);
  const parent = await getDBTopic(topic.parent_id);
  return [topic, parent];
};

export const getDBChildren = async (id) => {
  const [topics] = await mysql_pool.query(
    "SELECT * FROM `topic` WHERE `parent_id` = ?",
    [id]
  );
  return topics;
};

export const getDBChildrenByName = async (name) => {
  const parent = await getDBTopicByName(name);
  const [topics] = await mysql_pool.query(
    "SELECT * FROM `topic` WHERE `parent_id` = ?",
    [parent.id]
  );
  return topics;
};

export const createDBTopic = async ({ name, parent_id, children }) => {
  const connection = await mysql_pool.getConnection();

  let result;
  try {
    await connection.beginTransaction();
    [result] = await connection.query(
      "INSERT INTO `topic`(`name`, `parent_id`) VALUES (?, ?);",
      [name, parent_id]
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

//-----------------Post---------------------
export const getDBPost = async (pid) => {
  const [post] = await mysql_pool.query("SELECT * FROM `post` WHERE `id` = ?", [
    pid,
  ]);
  return post[0];
};

export const getDBLastestPosts = async ({ number, current }) => {
  const [posts] = await mysql_pool.query(
    "SELECT * FROM `post` ORDER BY `id` DESC LIMIT ? OFFSET ?;",
    [+number, +current]
  );
  return posts;
};

//reference: https://stackoverflow.com/questions/70240102/multiple-transactions-in-mysql-for-node
//reference: https://stackoverflow.com/questions/4073923/select-last-row-in-mysql
//reference: https://stackoverflow.com/questions/33957252/node-js-mysql-query-where-id-array