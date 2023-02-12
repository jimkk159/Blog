import mysql_pool from "../index.js";

export const getDBLastestPosts = async ({ number, current }) => {
  const [posts] = await mysql_pool.query(
    "SELECT * FROM `post` ORDER BY `id` DESC LIMIT ? OFFSET ?;",
    [+number, +current]
  );
  return posts;
};

export const getDBLastestFullPosts = async ({ number, current }) => {
  const [posts] = await mysql_pool.query(
    "SELECT `post`.`id`, `post`.`author_id`,`topic`.`topic` as `topic`, `post`.`type`,`post`.`pin`,`post`.`cover`,`post`.`language`,`post`.`tags`,`post`.`update` FROM `post` JOIN `topic` ON `topic`.`id` = `post`.`topic_id` ORDER BY `id` DESC  LIMIT ? OFFSET ?;",
    [+number, +current]
  );
  return posts;
};

//-----------------id---------------------
export const getDBPost = async (pid) => {
  const [post] = await mysql_pool.query("SELECT * FROM `post` WHERE `id` = ?", [
    pid,
  ]);
  return post[0];
};

export const getDBFullPost = async (pid) => {
  const [post] = await mysql_pool.query(
    "SELECT `post`.`id`, `post`.`author_id`, `post`.`topic_id`,`topic`.`topic` as `topic`, `post`.`type`,`post`.`pin`,`post`.`cover`,`post`.`language`,`post`.`tags`,`post`.`update` FROM `post` JOIN `topic` ON `topic`.`id` = `post`.`topic_id` WHERE `post`.`id` = ?",
    [pid]
  );
  return post[0];
};
