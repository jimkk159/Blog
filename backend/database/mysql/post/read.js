import mysql_pool from "../index.js";

export const getDBLastestPosts = async ({ number, current }) => {
  const [posts] = await mysql_pool.query(
    "SELECT * FROM `post` ORDER BY `update` DESC LIMIT ? OFFSET ?;",
    [+number, +current]
  );
  return posts;
};

export const getDBLastestFullPosts = async ({ number, current }) => {
  const [posts] = await mysql_pool.query(
    "SELECT `post`.`id`, `post`.`update`, `post`.`pin`, `post`.`cover`, `post`.`topic_id`, " +
      "`topic`.`topic`, " +
      "`user`.`id` as `author_id`, `user`.`name` as `author`, `user`.`avatar` as `avatar`, " +
      "`postEn`.`title` as `en_title`, `postEn`.`short` as `en_short`, `postEn`.`content` as `en_content`, " +
      "`postCh`.`title` as `ch_title`, `postCh`.`short` as `ch_short`, `postCh`.`content` as `ch_content`, " +
      "GROUP_CONCAT(`tag`.`tag`) " +
      "FROM `post` " +
      "LEFT JOIN `postTag` ON `post`.`id` = `postTag`.`post_id` " +
      "LEFT JOIN `tag` ON `postTag`.`tag_id` = `tag`.`id` " +
      "LEFT JOIN `topic` ON `post`.`topic_id` = `topic`.`id` " +
      "LEFT JOIN `user` ON `post`.`author_id` = `user`.`id` " +
      "LEFT JOIN `postEn` ON `postEn`.`post_id` = `post`.`id` " +
      "LEFT JOIN `postCh` ON `postCh`.`post_id` = `post`.`id` " +
      "GROUP BY `post`.`id`" +
      "ORDER BY `pin` DESC, `update` DESC  LIMIT ? OFFSET ?;",
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
    "SELECT `post`.`id`, `post`.`update`, `post`.`pin`, `post`.`cover`, `post`.`topic_id`, " +
      "`topic`.`topic`, " +
      "`user`.`id` as `author_id`, `user`.`name` as `author`, `user`.`avatar` as `avatar`, " +
      "`postEn`.`title` as `en_title`, `postEn`.`short` as `en_short`, `postEn`.`content` as `en_content`, " +
      "`postCh`.`title` as `ch_title`, `postCh`.`short` as `ch_short`, `postCh`.`content` as `ch_content`, " +
      "GROUP_CONCAT(`tag`.`tag`) " +
      "FROM `post` " +
      "LEFT JOIN `postTag` ON `post`.`id` = `postTag`.`post_id` " +
      "LEFT JOIN `tag` ON `postTag`.`tag_id` = `tag`.`id` " +
      "LEFT JOIN `topic` ON `post`.`topic_id` = `topic`.`id` " +
      "LEFT JOIN `user` ON `post`.`author_id` = `user`.`id` " +
      "LEFT JOIN `postEn` ON `postEn`.`post_id` = `post`.`id` " +
      "LEFT JOIN `postCh` ON `postCh`.`post_id` = `post`.`id` " +
      "WHERE `post`.`id` = ? " +
      "GROUP BY `post`.`id`",
    [pid]
  );
  return post[0];
};

export const getDBRelatedPost = async (pid, number) => {
  let tags;
  let post;
  const [posts] = await mysql_pool.query(
    "SELECT `post`.*, GROUP_CONCAT(DISTINCT `tag`.`id` SEPARATOR ',') as `tags` FROM `post` " +
      "LEFT JOIN `postTag` ON `post`.`id` = `postTag`.`post_id` " +
      "LEFT JOIN `tag` ON `tag`.`id` = `postTag`.`tag_id` " +
      "WHERE `post`.`id` = ?" +
      "GROUP BY `post`.`id`;",
    [pid]
  );

  post = posts[0];
  if (tags) tags = post.tags.split(",");
  else tags = [-1];
  const [search_posts] = await mysql_pool.query(
    "SELECT `post`.`id`, `post`.`author_id`, `user`.`name`, `post`.`topic_id`, `postEn`.`title` as `en` , `postCh`.`title` as `ch`  FROM `post`" +
      "LEFT JOIN `postEn` ON  `post`.`id` = `postEn`.`post_id`" +
      "LEFT JOIN `postCh` ON  `post`.`id` = `postCh`.`post_id`" +
      "LEFT JOIN `user` ON  `post`.`author_id` = `user`.`id`" +
      "LEFT JOIN `postTag` ON `post`.`id` = `postTag`.`post_id`" +
      "WHERE NOT `post`.`id` = ?" +
      "GROUP BY `post`.`id` " +
      "ORDER BY " +
      "CASE WHEN (`post`.`author_id` = ? AND `post`.`topic_id` = ? AND `postTag`.`tag_id` IN (?)) THEN 0 ELSE 1 END ASC, " + //Satisfy the topic, author and tag
      "CASE WHEN (`post`.`author_id` = ? AND `post`.`topic_id` = ?) THEN 0 ELSE 1 END ASC," + //Satisfy the topic, author
      "CASE WHEN (`post`.`topic_id` = ? AND `postTag`.`tag_id` IN (?)) THEN 0 ELSE 1 END ASC, " + //Satisfy the topic and tag
      "CASE WHEN (`post`.`author_id` = ? AND `postTag`.`tag_id` IN (?)) THEN 0 ELSE 1 END ASC," + //Satisfy the author and tag
      "CASE WHEN (`post`.`topic_id` = ?)  THEN 0 ELSE 1 END ASC," + //Satisfy the topic
      "CASE WHEN (`postTag`.`tag_id` IN (?))  THEN 0 ELSE 1 END ASC," + //Satisfy the tags
      "CASE WHEN (`post`.`author_id` = ?)  THEN 0 ELSE 1 END ASC " + //Satisfy the author
      "limit 5;",
    [
      pid,
      post.author_id,
      post.topic_id,
      tags,
      post.author_id,
      post.topic_id,
      post.topic_id,
      tags,
      post.author_id,
      tags,
      post.topic_id,
      tags,
      post.author_id,
    ]
  );
  return search_posts;
};
