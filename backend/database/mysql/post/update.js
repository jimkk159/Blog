import mysql_pool from "../index.js";

//-----------------id---------------------
export const updateDBPost = async ({
  id,
  topic_id,
  type,
  cover,
  content,
  tags,
}) => {
  if (!id) throw new Error("Invalid id!");
  const connection = await mysql_pool.getConnection();

  let result;
  let nestedTags;
  let tagIds = [];
  nestedTags = tags.map((tag) => [tag]);
  try {
    await connection.beginTransaction();
    if (cover)
      [result] = await mysql_pool.query(
        "UPDATE `post` SET `topic_id` = ?, `type` = ?, `cover` = ? WHERE `id`= ?;",
        [topic_id, type, cover, id]
      );
    else
      [result] = await mysql_pool.query(
        "UPDATE `post` SET `topic_id` = ?, `type` = ? WHERE `id`= ?;",
        [topic_id, type, id]
      );
    if (content?.en) {
      await connection.query(
        "INSERT INTO `postEn`(`post_id`, `title`, `short`, `content`) VALUES (?) " +
          "ON DUPLICATE KEY UPDATE `title` = ?, `short` = ?, `content` = ?",
        [
          [id, content.en?.title, content.en?.short, content.en?.content],
          content.en?.title,
          content.en?.short,
          content.en?.content,
        ]
      );
    }

    if (content?.ch) {
      await connection.query(
        "INSERT INTO `postCh`(`post_id`, `title`, `short`, `content`) VALUES (?) " +
          "ON DUPLICATE KEY UPDATE `title` = ?, `short` = ?, `content` = ?",
        [
          [id, content.ch?.title, content.ch?.short, content.ch?.content],
          content.ch?.title,
          content.ch?.short,
          content.ch?.content,
        ]
      );
    }

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
        "INSERT IGNORE INTO `postTag`(`post_id`, `tag_id`)" +
          "SELECT `post`.`id`, `tag`.`id` FROM `post` INNER JOIN `tag` ON `post`.`id` = ? " +
          "WHERE `tag`.`id` IN (?);",
        [id, tagIds]
      );

      await connection.query(
        "DELETE FROM `postTag` " +
          "WHERE `post_id` = ? AND `tag_id` NOT IN (?);",
        [id, tagIds]
      );
    } else if (Array.isArray(tags) && tags.length === 0) {
      await connection.query("DELETE FROM `postTag` WHERE `post_id` = ?;", [
        id,
      ]);
    } else {
      throw new Error("Unexpected error occur!");
    }

    await connection.commit();
    connection.release();
  } catch (err) {
    await connection.rollback();
    connection.release();
    throw new Error(err);
  }

  return result;
};

export const updateDBPostPin = async ({ pid, pin }) => {
  const [result] = await mysql_pool.query(
    "UPDATE `post` SET `pin` = ? WHERE `id`= ?;",
    [+pin, pid]
  );
  return result;
};
