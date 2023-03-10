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
  joinPostAndPostTag,
  joinTagAndPostTag,
  joinPostAndTopic,
  joinPostAndAuthor,
  joinPostAndPostEn,
  joinPostAndPostCh,
} from "../../utils/table.js";

export const getOnePost = async (id) => {
  //Generate MySql Syntax
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

  const [post] = await queryPool.query(features.query, features.values);
  return post;
};

export const getManyPostByKeys = async ({ key, vals, strict = false }) => {
  if (!Array.isArray(vals) || vals.length === 0) return [];

  //Generate MySql Syntax
  const features = new apiFeatures.getAllFeatures(`post`)
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
      `${postCh_}.${title_} AS \`ch_title\``,
      `${postCh_}.${short_} AS \`ch_short\``,
      `GROUP_CONCAT(${tag_}.${tag_name_}) AS \`tags\``,
    ]);

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

    return (await queryPool.query(features.query, features.values)) ?? [];
  }

  features
    .sort(`IF(FIELD(${post_}.${key}, ?) = 0, 1, 0) , FIELD(${post_}.${key}, ?)`)
    .appendValues([[...vals], [...vals]])
    .paginate();

  return (await queryPool.query(features.query, features.values)) ?? [];
};

export const getAllPost = async (query) => {
  //Generate MySql Syntax
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

  return (await queryPool.query(features.query, features.values)) ?? [];
};

export const getRelatedPostTitleIds = async (ids, target, limit, language) => {
  let inputIds = [-1, ...ids];
  const postLanguage = language === "ch" ? postCh_ : postEn_;

  //Generate MySql Syntax
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

  const newIds = (await queryPool.query(features.query, features.values)).map(
    (element) => element.id
  );

  inputIds.shift();
  if (!newIds.length) return inputIds;
  return [...inputIds, ...newIds];
};

export const getRelatedTopicIds = async (ids, target, limit) => {
  let inputIds = [-1, ...ids];
  //Generate MySql Syntax
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
  const newIds = (await queryPool.query(features.query, features.values)).map(
    (element) => element.id
  );

  inputIds.shift();
  if (!newIds.length) return inputIds;
  return [...inputIds, ...newIds];
};

export const getRelatedTagIds = async (ids, target, limit) => {
  let inputIds = [-1, ...ids];

  //Generate MySql Syntax
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
  const newIds = (await queryPool.query(features.query, features.values)).map(
    (element) => element.id
  );

  inputIds.shift();
  if (!newIds.length) return inputIds;
  return [...inputIds, ...newIds];
};

export const getRelatedAuthorIds = async (ids, target, limit) => {
  let inputIds = [-1, ...ids];

  //Generate MySql Syntax
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
  const newIds = (await queryPool.query(features.query, features.values)).map(
    (element) => element.id
  );

  inputIds.shift();
  if (!newIds.length) return inputIds;
  return [...inputIds, ...newIds];
};

export const getSearchPost = async (target, limit) => {
  let ids = [];

  //Title En
  if (limit >= ids.length)
    ids = await getRelatedPostTitleIds(ids, target, limit, "en");

  //Title Ch
  if (limit >= ids.length)
    ids = await getRelatedPostTitleIds(ids, target, limit, "ch");

  //Topic
  if (limit >= ids.length) ids = await getRelatedTopicIds(ids, target, limit);

  //Tag
  if (limit >= ids.length) ids = await getRelatedTagIds(ids, target, limit);

  //Author
  if (limit >= ids.length) ids = await getRelatedAuthorIds(ids, target, limit);

  return await getManyPostByKeys({
    key: id_,
    vals: ids,
    strict: true,
  });
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
  const insertId = await queryConnection.createOne(
    connection,
    post_,
    [author_id_, topic_id_, type_, cover_],
    [author_id, topic_id, type, cover]
  );

  if (content?.en)
    await queryConnection.createOne(
      connection,
      postEn_,
      [post_id_, title_, short_, detail_],
      [insertId, content.en?.title, content.en?.short, content.en?.detail]
    );

  if (content?.ch)
    await queryConnection.createOne(
      connection,
      postCh_,
      [post_id_, title_, short_, detail_],
      [insertId, content.ch?.title, content.ch?.short, content.ch?.detail]
    );

  //Add new tags, Reference to the post
  if (Array.isArray(tags) && !tags.length) {
    await queryConnection.query(
      connection,
      `INSERT IGNORE INTO ${tag_}(${tag_}) VALUES ?;`,
      [tags.map((tag) => [tag])]
    );

    const tagIds = (
      await queryConnection.query(
        connection,
        `SELECT ${tag_}.${id_} FROM ${tag_} WHERE ${tag_}.${tag_} IN (?);`,
        [tags]
      )
    ).map((tag) => tag.id);

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
  console.log(tags, !tags.length);
  if (!tags.length) {
    await queryConnection.query(
      connection,
      `DELETE FROM ${postTag_} WHERE ${post_id_} = ?;`,
      [id]
    );
  } else {
    await queryConnection.query(
      connection,
      `INSERT IGNORE INTO ${tag_}(${tag_}) VALUES ?;`,
      [tags.map((tag) => [tag])]
    );

    let tagIds = (
      await queryConnection.getMany(
        connection,
        tag_,
        `${tag_}.${tag_name_}`,
        tags,
        `${tag_}.${id_}`
      )
    ).map((element) => element.id);

    if (!!tagIds.length)
      await queryConnection.query(
        connection,
        `INSERT IGNORE INTO ${postTag_}(${post_id_}, ${tag_id_}) ` +
          `SELECT ${post_}.${id_}, ${tag_}.${id_} FROM ${post_} INNER JOIN ${tag_} ON ${post_}.${id_} = ? ` +
          `WHERE ${tag_}.${id_} IN (?);`,
        [id, tagIds]
      );

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
    if (topic_id) {
      cols.push(`${topic_id_} = ?`);
      vals.push(topic_id);
    }
    if (type) {
      cols.push(`${type_} = ?`);
      vals.push(type);
    }
    if (cover) {
      cols.push(`${cover_} = ?`);
      vals.push(cover);
    }

    if (!!cols.length)
      await queryConnection.updateOne(connection, "`post`", cols.join(", "), [
        ...vals,
        id,
      ]);

    if (content?.en)
      await updateLanguagePost(
        connection,
        id,
        "en",
        content.en?.title,
        content.en?.short,
        content.en?.detail
      );

    if (content?.ch)
      await updateLanguagePost(
        connection,
        id,
        "ch",
        content.ch?.title,
        content.ch?.short,
        content.ch?.detail
      );

    //Handle with Tags
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
  const [result] = await queryPool.updateOne(post_, `${pin_} = ?`, [+pin, id]);
  return result;
};

export default {
  getOnePost,
  getAllPost,
  getManyPostByKeys,
  getSearchPost,
  createOnePost,
  updateOnePost,
};
//Reference: https://dba.stackexchange.com/questions/76973/what-is-faster-one-big-query-or-many-small-queries
//Reference: https://dba.stackexchange.com/questions/36391/is-there-an-execution-difference-between-a-join-condition-and-a-where-condition/36409#36409
//Reference: https://dba.stackexchange.com/questions/109120/how-does-order-by-field-in-mysql-work-internally
//Reference: https://stackoverflow.com/questions/67349706/which-one-is-better-iterate-and-sort-data-in-backend-or-let-the-database-handle
