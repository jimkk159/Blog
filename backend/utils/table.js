//--------------token-----------------
export const access_token_ = "`token`";
export const refresh_token_ = null;

//---------------table----------------
export const post_ = "`post`";
export const topic_ = "`topic`";
export const auth_ = "`auth`";
export const user_ = "`user`";
export const postEn_ = "`postEn`";
export const postCh_ = "`postCh`";
export const postTag_ = "`postTag`";

//---------------column---------------
export const id_ = "`id`";
export const type_ = "`type`";
export const tag_ = "`tag`";
export const title_ = "`title`";
export const short_ = "`short`";
export const detail_ = "`detail`";
export const update_ = "`update`";
export const pin_ = "`pin`";
export const cover_ = "`cover`";
export const topic_name_ = "`name`";
export const user_name_ = "`name`";
export const tag_name_ = "`tag`";
export const avatar_ = "`avatar`";
export const author_id_ = "`author_id`";
export const post_id_ = "`post_id`";
export const topic_id_ = "`topic_id`";
export const tag_id_ = "`tag_id`";
export const parent_id_ = "`parent_id`";
export const user_id_ = "`user_id`";
export const provider_ = "`provider`";
export const password_ = "`password`";
export const expire_in_ = "`expire_in`";
export const email_ = "`email`";
export const parent_ = "`parent`";
export const role_ = "`role`";

//-----------compose field-------------
export const postFields = [
  `${post_}.${id_}`,
  `${post_}.${update_}`,
  `${post_}.${pin_}`,
  `${post_}.${cover_}`,
  `${post_}.${topic_id_}`,
  `${topic_}.${topic_name_} AS \`topic\``,
  `${post_}.${author_id_}`,
  `${user_}.${user_name_} AS \`author\``,
  `${user_}.${avatar_} AS \`avatar\``,
];

//-----------join table-------------
export const joinPostAndPostTag = [
  "LEFT",
  `${postTag_}`,
  `${post_}.${id_} = ${postTag_}.${post_id_}`,
];
export const joinTagAndPostTag = [
  "LEFT",
  `${tag_}`,
  `${tag_}.${id_} = ${postTag_}.${tag_id_}`,
];
export const joinPostAndTopic = [
  "LEFT",
  `${topic_}`,
  `${post_}.${topic_id_} = ${topic_}.${id_}`,
];
export const joinPostAndAuthor = [
  "LEFT",
  `${user_}`,
  `${post_}.${author_id_} = ${user_}.${id_}`,
];
export const joinPostAndPostEn = [
  "LEFT",
  `${postEn_}`,
  `${postEn_}.${post_id_} = ${post_}.${id_}`,
];
export const joinPostAndPostCh = [
  "LEFT",
  `${postCh_}`,
  `${postCh_}.${post_id_} = ${post_}.${id_}`,
];
