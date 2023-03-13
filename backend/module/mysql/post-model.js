import pool from "./index.js";
import queryPool from "./pool.js";
import queryConnection from "./connection.js";
import apiFeatures from "../../utils/api-features.js";
import {
  user_,
  post_,
  topic_,
  postTag_,
  postEn_,
  postCh_,
  id_,
  tag_,
  type_,
  title_,
  short_,
  detail_,
  cover_,
  user_name_,
  topic_name_,
  tag_name_,
  tag_id_,
  author_id_,
  post_id_,
  topic_id_,
  postFields,
  pin_,
  joinPostAndPostTag,
  joinTagAndPostTag,
  joinPostAndTopic,
  joinPostAndAuthor,
  joinPostAndPostEn,
  joinPostAndPostCh,
} from "../../utils/table.js";

export const getOnePost = async (id) => {
  // 1) Generate MySql Syntax
  const features = new apiFeatures.getAllFeatures(`post`, {
    [`${post_}.${id_}`]: id,
  })
    .join(...joinPostAndPostTag)
    .join(...joinTagAndPostTag)
    .join(...joinPostAndTopic)
    .join(...joinPostAndAuthor)
    .join(...joinPostAndPostEn)
    .join(...joinPostAndPostCh)
    .filter()
    .group(`${post_}.${id_}`)
    .limitFields([
      ...postFields,
      `${postEn_}.${title_} AS \`en_title\``,
      `${postEn_}.${short_} AS \`en_short\``,
      `${postEn_}.${detail_} AS \`en_detail\``,
      `${postCh_}.${title_} AS \`ch_title\``,
      `${postCh_}.${short_} AS \`ch_short\``,
      `${postCh_}.${detail_} AS \`ch_detail\``,
      `GROUP_CONCAT(${tag_}.${tag_name_}) AS \`tags\``,
    ]);

  // 2) Query MySql database
  const [post] = await queryPool.query(features.query, features.values);
  return post;
};

export const getManyPostByKeys = async (
  key,
  vals,
  queryString,
  strict = false
) => {
  //Check the vals
  if (!Array.isArray(vals) || vals.length === 0) return [];

  // 1) Generate MySql Syntax
  const features = new apiFeatures.getAllFeatures(`post`, queryString)
    .join(...joinPostAndPostTag)
    .join(...joinTagAndPostTag)
    .join(...joinPostAndTopic)
    .join(...joinPostAndAuthor)
    .join(...joinPostAndPostEn)
    .join(...joinPostAndPostCh)
    .filter()
    .group(`${post_}.${id_}`)
    .limitFields([
      ...postFields,
      `${postEn_}.${title_} AS \`en_title\``,
      `${postEn_}.${short_} AS \`en_short\``,
      `${postEn_}.${detail_} AS \`en_detail\``,
      `${postCh_}.${title_} AS \`ch_title\``,
      `${postCh_}.${short_} AS \`ch_short\``,
      `${postCh_}.${detail_} AS \`ch_detail\``,
      `GROUP_CONCAT(${tag_}.${tag_name_}) AS \`tags\``,
    ]);

  // 2) Just get the given ids of posts
  if (strict) {
    features
      .changeTable(
        `(SELECT * FROM ${post_} WHERE ${post_}.${key} in (?))${post_}`
      )
      .sort(
        `IF(FIELD(${post_}.${key}, ?) = 0, 1, 0) , FIELD(${post_}.${key}, ?)`
      )
      .appendValues([[...vals], [...vals], [...vals]])
      .paginate();

    // 3) Query MySql database
    return (await queryPool.query(features.query, features.values)) ?? [];
  }

  // 4) get the given ids of posts and other posts
  features
    .sort(`IF(FIELD(${post_}.${key}, ?) = 0, 1, 0) , FIELD(${post_}.${key}, ?)`)
    .appendValues([[...vals], [...vals]])
    .paginate();

  // 5) Query MySql database
  return (await queryPool.query(features.query, features.values)) ?? [];
};

export const getAllPost = async (query) => {
  // 1) Generate MySql Syntax
  const features = new apiFeatures.getAllFeatures(post_, query)
    .join(...joinPostAndPostTag)
    .join(...joinTagAndPostTag)
    .join(...joinPostAndTopic)
    .join(...joinPostAndAuthor)
    .join(...joinPostAndPostEn)
    .join(...joinPostAndPostCh)
    .filter()
    .group(`${post_}.${id_}`)
    .sort()
    .limitFields([
      ...postFields,
      `${postEn_}.${title_} AS \`en_title\``,
      `${postEn_}.${short_} AS \`en_short\``,
      `${postCh_}.${title_} AS \`ch_title\``,
      `${postCh_}.${short_} AS \`ch_short\``,
      `GROUP_CONCAT(${tag_}.${tag_name_}) AS \`tags\``,
    ])
    .paginate();

  // 2) Query MySql database
  return (await queryPool.query(features.query, features.values)) ?? [];
};

export const getRelatedPostTitleIds = async (ids, target, limit, language) => {
  let inputIds = [-1, ...ids];
  const postLanguage = language === "ch" ? postCh_ : postEn_;

  // 1) Generate MySql Syntax
  const features = new apiFeatures.getAllFeatures(
    `(SELECT * FROM ${post_} WHERE ${post_}.${id_} NOT in (?))${post_}`,
    { limit },
    [inputIds, target, target]
  )
    .join(
      "INNER",
      `(SELECT * FROM ${postLanguage} WHERE ${postLanguage}.${title_} LIKE CONCAT('%', ?, '%') )${postLanguage}`,
      `${post_}.${id_} = ${postLanguage}.${post_id_}`
    )
    .sort(`CASE WHEN (${postLanguage}.${title_} = ?) THEN 0 ELSE 1 END ASC`)
    .limitFields([`${post_}.${id_}`])
    .paginate();

  // 2) Get related post
  const newIds = (await queryPool.query(features.query, features.values)).map(
    (element) => element.id
  );
  // 3) Remove the array initial prevent value -1
  inputIds.shift();
  if (!newIds.length) return inputIds;
  return [...inputIds, ...newIds];
};

export const getRelatedTopicIds = async (ids, target, limit) => {
  let inputIds = [-1, ...ids];

  // 1) Generate MySql Syntax
  const features = new apiFeatures.getAllFeatures(
    `(SELECT * FROM ${post_} WHERE ${post_}.${id_} NOT in (?))${post_}`,
    { limit },
    [inputIds, target]
  )
    .join(
      "INNER",
      `(SELECT * FROM ${topic_} WHERE ${topic_}.${topic_name_} LIKE CONCAT('%', ?, '%') )${topic_}`,
      `${post_}.${topic_id_} = ${topic_}.${id_}`
    )
    .limitFields([`${post_}.${id_}`])
    .paginate();

  // 2) Get related post
  const newIds = (await queryPool.query(features.query, features.values)).map(
    (element) => element.id
  );
  // 3) Remove the array initial prevent value -1
  inputIds.shift();
  if (!newIds.length) return inputIds;
  return [...inputIds, ...newIds];
};

export const getRelatedTagIds = async (ids, target, limit) => {
  let inputIds = [-1, ...ids];

  // 1) Generate MySql Syntax
  const features = new apiFeatures.getAllFeatures(
    `(SELECT * FROM ${post_} WHERE ${post_}.${id_} NOT in (?))${post_}`,
    { limit },
    [inputIds, target]
  )
    .join("LEFT", postTag_, `${post_}.${id_} = ${postTag_}.${post_id_}`)
    .join(
      "INNER",
      `(SELECT * FROM ${tag_} WHERE ${tag_}.${tag_name_} LIKE CONCAT('%', ?, '%') )${tag_}`,
      `${tag_}.${id_} = ${postTag_}.${tag_id_}`
    )
    .limitFields([`${post_}.${id_}`])
    .paginate();

  // 2) Get related post
  const newIds = (await queryPool.query(features.query, features.values)).map(
    (element) => element.id
  );

  // 3) Remove the array initial prevent value -1
  inputIds.shift();
  if (!newIds.length) return inputIds;
  return [...inputIds, ...newIds];
};

export const getRelatedAuthorIds = async (ids, target, limit) => {
  let inputIds = [-1, ...ids];

  // 1) Generate MySql Syntaxs
  const features = new apiFeatures.getAllFeatures(
    `(SELECT * FROM ${post_} WHERE ${post_}.${id_} NOT in (?))${post_}`,
    { limit },
    [inputIds, target]
  )
    .join(
      "INNER",
      `(SELECT * FROM ${user_} WHERE ${user_}.${user_name_} LIKE CONCAT('%', ?, '%') )${user_}`,
      `${post_}.${author_id_} = ${user_}.${id_}`
    )
    .limitFields([`${post_}.${id_}`])
    .paginate();
  // 2) Get related post
  const newIds = (await queryPool.query(features.query, features.values)).map(
    (element) => element.id
  );

  // 3) Remove the array initial prevent value -1
  inputIds.shift();
  if (!newIds.length) return inputIds;
  return [...inputIds, ...newIds];
};

export const getSearchPost = async (target, limit) => {
  let ids = [];

  // 1) Search related post for title in English
  if (limit >= ids.length)
    ids = await getRelatedPostTitleIds(ids, target, limit, "en");

  // 2) Search related post for title in Chinese
  if (limit >= ids.length)
    ids = await getRelatedPostTitleIds(ids, target, limit, "ch");

  // 3) Search related post topic
  if (limit >= ids.length) ids = await getRelatedTopicIds(ids, target, limit);

  // 4) Search related post tags
  if (limit >= ids.length) ids = await getRelatedTagIds(ids, target, limit);

  // 5) Search related post author
  if (limit >= ids.length) ids = await getRelatedAuthorIds(ids, target, limit);

  // 6) Get Post by ids
  return await getManyPostByKeys(id_, ids, {}, true);
};

//-----------------Post---------------------
export const createOnePost = async ({
  author_id,
  topic_id,
  type,
  cover,
  content,
  tags,
}) => {
  const connection = await pool.getConnection();

  await connection.beginTransaction();
  // 1) Create Post
  const insertId = await queryConnection.createOne(
    connection,
    post_,
    [author_id_, topic_id_, type_, cover_],
    [author_id, topic_id, type, cover]
  );

  // 2) Create Post English content
  if (content?.en)
    await queryConnection.createOne(
      connection,
      postEn_,
      [post_id_, title_, short_, detail_],
      [insertId, content.en?.title, content.en?.short, content.en?.detail]
    );

  // 3) Create Post Chinese content
  if (content?.ch)
    await queryConnection.createOne(
      connection,
      postCh_,
      [post_id_, title_, short_, detail_],
      [insertId, content.ch?.title, content.ch?.short, content.ch?.detail]
    );

  // 4) Add new tags which are reference to the post
  if (Array.isArray(tags) && !tags.length) {
    await queryConnection.query(
      connection,
      `INSERT IGNORE INTO ${tag_}(${tag_}) VALUES ?;`,
      [tags.map((tag) => [tag])]
    );

    // 5) Get the id of tags
    const tagIds = (
      await queryConnection.query(
        connection,
        `SELECT ${tag_}.${id_} FROM ${tag_} WHERE ${tag_}.${tag_} IN (?);`,
        [tags]
      )
    ).map((tag) => tag.id);

    // 6) Add the relation to the table of post between tags
    await queryConnection.query(
      connection,
      `INSERT INTO ${postTag_}(${post_id_}, ${tag_id_}) ` +
        `SELECT ${post_}.${id_}, ${tag_}.${id_} FROM ${post_} INNER JOIN ${tag_} ON ${post_}.${id_} = ? ` +
        `WHERE ${tag_}.${id_} IN (?);`,
      [insertId, tagIds]
    );
  }
  await connection.commit();
  connection.release();

  return insertId;
};

//---------------Put-------------------
export const updateLanguagePost = async (
  connection,
  id,
  language,
  title,
  short,
  detail
) => {
  // 1) Parse the input
  const postLanguage = language === "ch" ? postCh_ : postEn_;
  let colsA = [];
  let colsB = [];
  let vals = [];
  if (title) {
    colsA.push(`${title_}`);
    colsB.push(`${title_} = ?`);
    vals.push(title);
  }
  if (short) {
    colsA.push(`${short_}`);
    colsB.push(`${short_} = ?`);
    vals.push(short);
  }
  if (detail) {
    colsA.push(`${detail_}`);
    colsB.push(`${detail_} = ?`);
    vals.push(detail);
  }
  // 2) Update the post content
  if (!!colsA.length)
    await queryConnection.query(
      connection,
      `INSERT INTO ${postLanguage}(${post_id_}, ${colsA.join(
        ","
      )}) VALUES (?) ` + `ON DUPLICATE KEY UPDATE ${colsB.join(",")}`,
      [[id, ...vals], ...vals]
    );
};

export const updateTagPost = async (connection, id, tags) => {
  if (!tags.length) {
    // 1) Delete all the post tags
    await queryConnection.query(
      connection,
      `DELETE FROM ${postTag_} WHERE ${post_id_} = ?;`,
      [id]
    );
  } else {
    // 1) Create tags to table
    await queryConnection.query(
      connection,
      `INSERT IGNORE INTO ${tag_}(${tag_}) VALUES ?;`,
      [tags.map((tag) => [tag])]
    );
    // 2) Get id of tags
    let tagIds = (
      await queryConnection.getMany(
        connection,
        tag_,
        `${tag_}.${tag_name_}`,
        tags,
        `${tag_}.${id_}`
      )
    ).map((element) => element.id);

    // 3) Update the relation to the table of post between tags
    if (!!tagIds.length)
      await queryConnection.query(
        connection,
        `INSERT IGNORE INTO ${postTag_}(${post_id_}, ${tag_id_}) ` +
          `SELECT ${post_}.${id_}, ${tag_}.${id_} FROM ${post_} INNER JOIN ${tag_} ON ${post_}.${id_} = ? ` +
          `WHERE ${tag_}.${id_} IN (?);`,
        [id, tagIds]
      );
    // 4) Delete the other post tags
    await queryConnection.query(
      connection,
      `DELETE FROM ${postTag_} ` +
        `WHERE ${post_id_} = ? AND ${tag_id_} NOT IN (?);`,
      [id, [-1, ...tagIds]]
    );
  }
};

export const updateOnePost = async ({
  id,
  topic_id,
  type,
  cover,
  content,
  tags,
}) => {
  let cols = [];
  let vals = [];

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    // 1) Parse the input
    if (topic_id) {
      cols.push(`${topic_id_}`);
      vals.push(topic_id);
    }
    if (type) {
      cols.push(`${type_}`);
      vals.push(type);
    }
    if (cover) {
      cols.push(`${cover_}`);
      vals.push(cover);
    }
    // 2) update Post
    if (!!cols.length)
      await queryConnection.updateOne(
        connection,
        post_,
        cols,
        [id_],
        [...vals, id]
      );
    // 3) update post content in English
    if (content?.en)
      await updateLanguagePost(
        connection,
        id,
        "en",
        content.en?.title,
        content.en?.short,
        content.en?.detail
      );
    // 4) update post content in Chinese
    if (content?.ch)
      await updateLanguagePost(
        connection,
        id,
        "ch",
        content.ch?.title,
        content.ch?.short,
        content.ch?.detail
      );

    // 5) update post tags
    if (Array.isArray(tags)) await updateTagPost(connection, id, tags);

    await connection.commit();
    connection.release();
  } catch (err) {
    await connection.rollback();
    connection.release();
    throw new Error(err);
  }
};

//---------------Patch-------------------
export const updatePostPin = async ({ id, pin }) => {
  await queryPool.updateOne(post_, [pin_], [id_], [+pin, id]);
};

export default {
  getOnePost,
  getAllPost,
  getManyPostByKeys,
  getSearchPost,
  createOnePost,
  updateOnePost,
  updatePostPin,
};
//Reference: https://dba.stackexchange.com/questions/76973/what-is-faster-one-big-query-or-many-small-queries
//Reference: https://dba.stackexchange.com/questions/36391/is-there-an-execution-difference-between-a-join-condition-and-a-where-condition/36409#36409
//Reference: https://dba.stackexchange.com/questions/109120/how-does-order-by-field-in-mysql-work-internally
//Reference: https://stackoverflow.com/questions/67349706/which-one-is-better-iterate-and-sort-data-in-backend-or-let-the-database-handle
