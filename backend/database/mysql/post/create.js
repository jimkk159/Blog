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
  let nestedTags;
  let tagIds = [];
  nestedTags = tags.map((tag) => [tag]);
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

    //Handle with Tags
    if (Array.isArray(tags) && tags.length > 0) {
      await connection.query("INSERT IGNORE INTO `tag`(`tag`) VALUES ?;", [
        nestedTags,
      ]);
      const [tagDBIds] = await connection.query(
        "SELECT `tag`.`id` FROM `tag` WHERE `tag`.`tag` IN (?);",
        [tags]
      );
      tagIds = tagDBIds.map((tagId) => tagId.id);
      await connection.query(
        "INSERT INTO `postTag`(`post_id`, `tag_id`) " +
          "SELECT `post`.`id`, `tag`.`id` FROM `post` INNER JOIN `tag` ON `post`.`id` = ? " +
          "WHERE `tag`.`id` IN (?);",
        [result.insertId, tagIds]
      );
    }

    await connection.commit();
    connection.release();
  } catch (err) {
    await connection.rollback();
    connection.release();
    throw new Error(err);
  }

  return getDBPost(result.insertId);
};
