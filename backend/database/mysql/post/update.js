import mysql_pool from "../index.js";

//-----------------id---------------------
export const updateDBPost = async ({ pid, topic_id, language, tags }) => {
  const [result] = await mysql_pool.query(
    "UPDATE `post` SET `topic_id` = ?, `language` = ?, `tags` = ? WHERE `id`= ?;",
    [topic_id, language, tags, pid]
  );
  return result;
};

export const updateDBPostWithCover = async ({
  pid,
  topic_id,
  cover,
  language,
  tags,
}) => {
  const [result] = await mysql_pool.query(
    "UPDATE `post` SET `topic_id` = ?, `language` = ?, `tags` = ?, `cover` = ? WHERE `id`= ?;",
    [topic_id, language, tags, cover, pid]
  );
  return result;
};

export const updateDBPostPin = async ({ pid, pin }) => {
  const [result] = await mysql_pool.query(
    "UPDATE `post` SET `pin` = ? WHERE `id`= ?;",
    [+pin, pid]
  );
  return result;
};
