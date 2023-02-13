import mysql_pool from "../index.js";
import { getDBPost } from "../post/read.js";

//-----------------Post---------------------
export const createDBPost = async ({
  author_id,
  topic_id,
  type,
  cover,
  content,
  tags,
}) => {
  const connection = await mysql_pool.getConnection();

  let result;
  let tagIds = [];
  try {
    await connection.beginTransaction();
    [result] = await connection.query(
      "INSERT INTO `post`(`author_id`, `topic_id`, `type`, `cover`) VALUES (?, ?, ?, ?)",
      [author_id, topic_id, type, cover]
    );

    if (content?.en)
      await connection.query(
        "INSERT INTO `postEn`(`post_id`, `title`, `short`, `content`) VALUES (?, ?, ?, ?)",
        [
          result.insertId,
          content.en?.title,
          content.en?.short,
          content.en?.content,
        ]
      );

    if (content?.ch)
      await connection.query(
        "INSERT INTO `postCh`(`post_id`, `title`, `short`, `content`) VALUES (?, ?, ?, ?)",
        [
          result.insertId,
          content.ch?.title,
          content.ch?.short,
          content.ch?.content,
        ]
      );
      
    await Promise.all(
      tags.map(async (tag) => {
        const [result] = await connection.query(
          "INSERT IGNORE INTO `tag`(`tag`) VALUES (?);",
          tag
        );
        tagIds.push(result.insertId);
      })
    );

    await connection.query(
      "INSERT INTO `postTag`(`post_id`, `tag_id`) SELECT `post`.`id`, `tag`.`id` " +
        "FROM `post` INNER JOIN `tag` ON 1=1 " +
        "WHERE `post`.`id` = ?;",
      [result.insertId]
    );

    await connection.commit();
    connection.release();
  } catch (err) {
    await connection.rollback();
    connection.release();
    throw new Error(err);
  }

  return getDBPost(result.insertId);
};
