import mysql_pool from "../index.js";
import { getDBPost } from "../post/read.js";

//-----------------Post---------------------
export const createDBPost = async ({
  author_id,
  topic_id,
  type,
  cover,
  language,
  tags,
}) => {
  const [result] = await mysql_pool.query(
    "INSERT INTO `post`(`author_id`, `topic_id`, `type`,`cover`, `language`, `tags`) VALUES (?, ?, ?, ?, ?, ?)",
    [author_id, topic_id, type, cover, language, tags]
  );
  return getDBPost(result.insertId);
};
