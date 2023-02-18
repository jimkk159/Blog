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
      "GROUP_CONCAT(`tag`.`tag`) as tags " +
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

export const getDBFullPostsByIds = async ({ number, ids, strict = false }) => {
  let posts = [];
  const queryString =
    "SELECT `post`.`id`, `post`.`update`, `post`.`pin`, `post`.`cover`, `post`.`topic_id`, " +
    "`topic`.`topic`, " +
    "`user`.`id` as `author_id`, `user`.`name` as `author`, `user`.`avatar` as `avatar`, " +
    "`postEn`.`title` as `en_title`, `postEn`.`short` as `en_short`, `postEn`.`content` as `en_content`, " +
    "`postCh`.`title` as `ch_title`, `postCh`.`short` as `ch_short`, `postCh`.`content` as `ch_content`, " +
    "GROUP_CONCAT(`tag`.`tag`) as tags " +
    "FROM `post` " +
    "LEFT JOIN `postTag` ON `post`.`id` = `postTag`.`post_id` " +
    "LEFT JOIN `tag` ON `postTag`.`tag_id` = `tag`.`id` " +
    "LEFT JOIN `topic` ON `post`.`topic_id` = `topic`.`id` " +
    "LEFT JOIN `user` ON `post`.`author_id` = `user`.`id` " +
    "LEFT JOIN `postEn` ON `postEn`.`post_id` = `post`.`id` " +
    "LEFT JOIN `postCh` ON `postCh`.`post_id` = `post`.`id` " +
    "GROUP BY `post`.`id`";
  const queryNumber = number ? number : 0;

  if (!Array.isArray(ids) || ids.length === 0) {
    [posts] = await mysql_pool.query(queryString + "LIMIT ?;", [+queryNumber]);
    return posts ? posts : [];
  }

  if (!strict) {
    [posts] = await mysql_pool.query(
      queryString +
        "ORDER BY IF(FIELD(`post`.`id`, ?) = 0, 1, 0) " +
        "LIMIT ?;",
      [ids, +queryNumber]
    );
    return posts ? posts : [];
  }

  [posts] = await mysql_pool.query(
    queryString.replace(
      "FROM `post` ",
      "FROM (SELECT * FROM `post` WHERE `post`.`id` in (?))`post` "
    ) + "ORDER BY IF(FIELD(`post`.`id`, ?) = 0, 1, 0) LIMIT ?;",
    [ids, ids, +queryNumber]
  );
  return posts ? posts : [];
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
      "GROUP_CONCAT(`tag`.`tag`) as tags " +
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

export const getDBRelatedPosts = async (pid, number) => {
  let tagIds;
  let post;
  let filter_posts;
  let search_posts;

  const [posts] = await mysql_pool.query(
    "SELECT `post`.*, GROUP_CONCAT(DISTINCT `tag`.`id` SEPARATOR ',') as `tags` " +
      "FROM (SELECT * FROM `post` WHERE `post`.`id` = ?)`post` " +
      "LEFT JOIN `postTag` ON `post`.`id` = `postTag`.`post_id` " +
      "LEFT JOIN `tag` ON `tag`.`id` = `postTag`.`tag_id` " +
      "GROUP BY `post`.`id`;",
    [pid]
  );

  if (!posts) throw new Error("Finding Target Post Fail!");

  let filterIDs = [+pid];
  post = posts[0];
  tagIds = post?.tags;
  if (tagIds) tagIds = post.tags.split(",");
  else tagIds = [-1];

  //author + topic + tags
  if (1 + number > filterIDs.length) {
    [filter_posts] = await mysql_pool.query(
      "SELECT `post`.`id` FROM " +
        "(SELECT * FROM `post` WHERE `post`.`id` NOT IN (?))`post` " +
        "INNER JOIN " +
        "(SELECT * FROM `postTag` WHERE `postTag`.`tag_id` IN (?))`postTag` " +
        "ON `postTag`.`post_id` = `post`.`id` " +
        "WHERE `post`.`author_id` = ? AND `post`.`topic_id` = ? " +
        "LIMIT ?;",
      [filterIDs, tagIds, post?.author_id, post?.topic_id, number]
    );
    if (filter_posts)
      filterIDs = [...filterIDs, ...filter_posts.map((post) => post.id)];
  }

  //author + topic
  if (1 + number > filterIDs.length) {
    [filter_posts] = await mysql_pool.query(
      "SELECT `post`.`id` FROM " +
        "(SELECT * FROM `post` WHERE `post`.`id` NOT IN (?))`post`" +
        "WHERE (`post`.`author_id` = ? AND `post`.`topic_id` = ?) " +
        "LIMIT ?;",
      [filterIDs, post?.author_id, post?.topic_id, number]
    );
    if (filter_posts)
      filterIDs = [...filterIDs, ...filter_posts.map((post) => post.id)];
  }

  //topic + tags
  if (1 + number > filterIDs.length) {
    [filter_posts] = await mysql_pool.query(
      "SELECT `post`.`id` FROM " +
        "(SELECT * FROM `post` WHERE `post`.`id` NOT IN (?))`post`" +
        "INNER JOIN " +
        "(SELECT * FROM `postTag` WHERE `postTag`.`tag_id` IN (?))`postTag` " +
        "WHERE `post`.`topic_id` = ? " +
        "LIMIT ?;",
      [filterIDs, tagIds, post?.topic_id, number]
    );
    if (filter_posts)
      filterIDs = [...filterIDs, ...filter_posts.map((post) => post.id)];
  }

  //author + tags
  if (1 + number > filterIDs.length) {
    [filter_posts] = await mysql_pool.query(
      "SELECT `post`.`id` FROM " +
        "(SELECT * FROM `post` WHERE `post`.`id` NOT IN (?))`post`" +
        "INNER JOIN " +
        "(SELECT * FROM `postTag` WHERE `postTag`.`tag_id` IN (?))`postTag` " +
        "WHERE `post`.`author_id` = ? " +
        "LIMIT ?;",
      [filterIDs, tagIds, post?.author_id, number]
    );
    if (filter_posts)
      filterIDs = [...filterIDs, ...filter_posts.map((post) => post.id)];
  }

  //topic
  if (1 + number > filterIDs.length) {
    [filter_posts] = await mysql_pool.query(
      "SELECT `post`.`id` FROM " +
        "(SELECT * FROM `post` WHERE `post`.`id` NOT IN (?))`post`" +
        "WHERE `post`.`topic_id` = ? " +
        "LIMIT ?;",
      [filterIDs, post?.topic_id, number]
    );
    if (filter_posts)
      filterIDs = [...filterIDs, ...filter_posts.map((post) => post.id)];
  }

  //tags
  if (1 + number > filterIDs.length) {
    [filter_posts] = await mysql_pool.query(
      "SELECT `post`.`id` FROM " +
        "(SELECT * FROM `post` WHERE `post`.`id` NOT IN (?))`post`" +
        "INNER JOIN " +
        "(SELECT * FROM `postTag` WHERE `postTag`.`tag_id` IN (?))`postTag` " +
        "LIMIT ?;",
      [filterIDs, tagIds, number]
    );
    if (filter_posts)
      filterIDs = [...filterIDs, ...filter_posts.map((post) => post.id)];
  }

  //author
  if (1 + number > filterIDs.length) {
    [filter_posts] = await mysql_pool.query(
      "SELECT `post`.`id` FROM " +
        "(SELECT * FROM `post` WHERE `post`.`id` NOT IN (?))`post`" +
        "WHERE `post`.`author_id` = ? " +
        "LIMIT ?;",
      [filterIDs, post?.author_id, number]
    );
    if (filter_posts)
      filterIDs = [...filterIDs, ...filter_posts.map((post) => post.id)];
  }
  filterIDs.shift();
  if (filterIDs.length === 0) return [];
  [search_posts] = await mysql_pool.query(
    "SELECT `post`.`id`, `post`.`author_id`, `user`.`name`, `post`.`topic_id`, `postEn`.`title` as `en` , `postCh`.`title` as `ch` " +
      "FROM `post` " +
      "LEFT JOIN `user` ON  `post`.`author_id` = `user`.`id` " +
      "LEFT JOIN `topic` ON `post`.`topic_id` = `topic`.`id` " +
      "LEFT JOIN `postEn` ON  `post`.`id` = `postEn`.`post_id` " +
      "LEFT JOIN `postCh` ON  `post`.`id` = `postCh`.`post_id` " +
      "WHERE `post`.`id` != ? " +
      "ORDER BY IF(FIELD(`post`.`id`, ?) = 0, 1, 0) " +
      "LIMIT ?;",
    [pid, filterIDs, number]
  );
  search_posts = search_posts.slice(0, 5);
  return search_posts ? [...search_posts] : [];
};

//ToDo Search by
export const getDBPostSearch = async (target, number) => {
  let filterIDs = [-1];
  let filter_posts;
  let search_posts;

  const queryString =
    "SELECT `post`.`id` FROM " +
    "(SELECT * FROM `post` WHERE `post`.`id` NOT in (?))`post` ";
  //Title En
  if (1 + number > filterIDs.length) {
    [filter_posts] = await mysql_pool.query(
      queryString +
        "INNER JOIN (SELECT * FROM `postEn` WHERE `postEn`.`title` LIKE CONCAT('%', ?, '%') )`postEn` " +
        "ON `post`.`id` = `postEn`.`post_id` " +
        "ORDER BY " +
        "CASE WHEN (`postEn`.`title` = ?) THEN 0 ELSE 1 END ASC " +
        "LIMIT ?;",
      [filterIDs, target, target, number]
    );
    if (filter_posts)
      filterIDs = [...filterIDs, ...filter_posts.map((post) => post.id)];
  }

  //Title Ch
  if (1 + number > filterIDs.length) {
    [filter_posts] = await mysql_pool.query(
      queryString +
        "INNER JOIN (SELECT * FROM `postCh` WHERE `postCh`.`title` LIKE CONCAT('%', ?, '%') )`postCh` " +
        "ON `post`.`id` = `postCh`.`post_id` " +
        "ORDER BY " +
        "CASE WHEN (`postCh`.`title` = ?) THEN 0 ELSE 1 END ASC " +
        "LIMIT ?;",
      [filterIDs, target, target, number]
    );
    if (filter_posts)
      filterIDs = [...filterIDs, ...filter_posts.map((post) => post.id)];
  }

  //Equal to topic
  if (1 + number > filterIDs.length) {
    [filter_posts] = await mysql_pool.query(
      queryString +
        "INNER JOIN (SELECT * FROM `topic` WHERE `topic`.`topic` = ?)`topic` " +
        "ON `post`.`topic_id` = `topic`.`id` " +
        "LIMIT ?;",
      [filterIDs, target, number]
    );
    if (filter_posts)
      filterIDs = [...filterIDs, ...filter_posts.map((post) => post.id)];
  }

  //Equal to tag
  if (1 + number > filterIDs.length) {
    [filter_posts] = await mysql_pool.query(
      queryString +
        "LEFT JOIN `postTag` ON `postTag`.`post_id` = `post`.`id`" +
        "INNER JOIN (SELECT * FROM `tag` WHERE `tag`.`tag` = ?)`tag` " +
        "ON `postTag`.`tag_id` = `tag`.`id` " +
        "LIMIT ?;",
      [filterIDs, target, number]
    );
    if (filter_posts)
      filterIDs = [...filterIDs, ...filter_posts.map((post) => post.id)];
  }

  //Equal to author
  if (1 + number > filterIDs.length) {
    [filter_posts] = await mysql_pool.query(
      queryString +
        "INNER JOIN (SELECT * FROM `user` WHERE `user`.`name` = ?)`user` " +
        "ON  `post`.`author_id` = `user`.`id` " +
        "LIMIT ?;",
      [filterIDs, target, number]
    );
    if (filter_posts)
      filterIDs = [...filterIDs, ...filter_posts.map((post) => post.id)];
  }

  //Include topic
  if (1 + number > filterIDs.length) {
    [filter_posts] = await mysql_pool.query(
      queryString +
        "INNER JOIN (SELECT * FROM `topic` WHERE `topic`.`topic` LIKE CONCAT('%', ?, '%'))`topic` " +
        "ON `post`.`topic_id` = `topic`.`id` " +
        "LIMIT ?;",
      [filterIDs, target, number]
    );
    if (filter_posts)
      filterIDs = [...filterIDs, ...filter_posts.map((post) => post.id)];
  }

  //Include tag
  if (1 + number > filterIDs.length) {
    [filter_posts] = await mysql_pool.query(
      queryString +
        "LEFT JOIN `postTag` ON `postTag`.`post_id` = `post`.`id` " +
        "INNER JOIN (SELECT * FROM `tag` WHERE `tag`.`tag` LIKE CONCAT('%', ?, '%'))`tag` " +
        "ON `tag`.`id` = `postTag`.`tag_id` " +
        "LIMIT ?;",
      [filterIDs, target, number]
    );
    if (filter_posts)
      filterIDs = [...filterIDs, ...filter_posts.map((post) => post.id)];
  }

  //Include author
  if (1 + number > filterIDs.length) {
    [filter_posts] = await mysql_pool.query(
      queryString +
        "INNER JOIN (SELECT * FROM `user` WHERE `user`.`name` LIKE CONCAT('%', ?, '%'))`user` " +
        "ON `post`.`author_id` = `user`.`id` " +
        "LIMIT ?;",
      [filterIDs, target, number]
    );
    if (filter_posts)
      filterIDs = [...filterIDs, ...filter_posts.map((post) => post.id)];
  }

  filterIDs.shift();
  console.log(filterIDs);
  if (filterIDs.length === 0) return [];
  return await getDBFullPostsByIds({
    number,
    ids: filterIDs,
    strict: true,
  });
};

//Reference: https://dba.stackexchange.com/questions/76973/what-is-faster-one-big-query-or-many-small-queries
//Reference: https://dba.stackexchange.com/questions/36391/is-there-an-execution-difference-between-a-join-condition-and-a-where-condition/36409#36409
//Reference: https://dba.stackexchange.com/questions/109120/how-does-order-by-field-in-mysql-work-internally
//Reference: https://stackoverflow.com/questions/67349706/which-one-is-better-iterate-and-sort-data-in-backend-or-let-the-database-handle
