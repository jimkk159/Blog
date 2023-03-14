import normalize from "normalize-path";
import HttpError from "../utils/http-error.js";
import queryPool from "../module/mysql/pool.js";
import catchAsync from "../utils/catch-async.js";
import authController from "./auth-controller.js";
import shareController from "./share-controller.js";
import postModel from "../module/mysql/post-model.js";
import topicModel from "../module/mysql/topic-model.js";
import { id_, post_ } from "../utils/table.js";
import topicHelper from "../utils/topic-helper.js";
import postHelper from "../utils/post-helper.js";
import authHelper from "../utils/auth-helper.js";

//-----------------Get---------------------
export const getOnePost = catchAsync(async (req, res, next) => {
  // 1) Parse the id
  let vals;
  if (("" + req.params.id).includes(",")) {
    vals = req.params.id.split(",").map(Number);
  } else {
    vals = [+req.params.id];
  }

  // 2) Get the Posts by ids
  let posts = await postModel.getManyPostByKeys(id_, vals, {
    limit: vals.length,
  });
  if (!posts.length) return next(new HttpError("Post not Find!", 404));

  // 3) Restruct the posts obj structure
  posts = await Promise.all(
    posts.map(async (elemnt) => {
      let post = postHelper.restructPost(elemnt);
      post = await postHelper.getTopicRelatedPost(post, 5);
      post = await postHelper.getTagRelatedPost(post, 5);
      post = await postHelper.getAuthorRelatedPost(post, 5);
      return post;
    })
  );

  res.status(200).json({
    status: "success",
    results: posts.length,
    data: {
      posts,
    },
  });
});

export const getAllPost = catchAsync(async (req, res, next) => {
  // 1) Get the Posts
  let posts = await postModel.getAllPost(req.query);

  // 2) Restruct the posts obj structure
  posts = posts.map((elemnt) => postHelper.restructPost(elemnt));
  res.status(200).json({
    status: "success",
    results: posts.length,
    data: {
      posts,
    },
  });
});

export const getPostSearch = catchAsync(async (req, res, next) => {
  const limit = +req.body.limit || 5;

  // 1) Get the Posts
  let posts = (await postModel.getSearchPost(req.query.search, limit)) ?? [];

  // 2) Restruct the posts obj structure
  posts = posts.map((elemnt) => postHelper.restructPost(elemnt));
  res.status(200).json({
    status: "success",
    results: posts.length,
    data: {
      posts,
    },
  });
});

//-----------------Post---------------------
export const createOnePost = catchAsync(async (req, res, next) => {
  // 1) Identify the user
  await authHelper.identifyUser(req.user.id);

  // 2) Identify the topic
  let topic = await topicHelper.identifyTopic(
    req.body.topic,
    req.body.parent,
    req.body.children
  );

  // 3) Create the topic if not exist
  if (!topic.exist) topic = await topicModel.createOneTopic({ ...topic });

  // 4) Replace the post image by http uri
  const detail = shareController.replaceImageSrc(
    req.body.map,
    req.body.detail,
    req.files,
    `${req.protocol}://${req.get("host")}`
  );

  // 5) Normalize the cover path
  let cover;
  if (
    req.files &&
    req.files.cover &&
    !req.files.cover.length &&
    req.files.cover[0].path
  ) {
    cover = normalize(req.files?.cover[0]?.path);
  }

  // 6) Only support English and Chinese
  if (!["en", "ch"].includes(req.body.language))
    return next(new HttpError("Unsupport language", 501));

  // 7) Fill up the post content
  const content = { en: null, ch: null };
  content[req.body.language] = {
    title: req.body.title,
    short: req.body.short,
    detail,
  };

  // 8) Create new post
  req.params.id = await postModel.createOnePost({
    author_id: req.user.id,
    topic_id: topic.id,
    type: req.body.type,
    cover,
    content,
    tags: Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags],
  });

  next();
});

//-----------------Put---------------------
export const updateOnePost = catchAsync(async (req, res, next) => {
  // 1) Identify the post
  const post = await postHelper.identifyPost(req.params.id);

  // 2) Identify the user
  await authHelper.identifyUser(req.user.id);

  // 3) Identify the user if author
  postHelper.identifyAuthor(post, req.user.id);

  // 4) Replace the post image by http uri
  const detail = shareController.replaceImageSrc(
    req.body.map,
    req.body.detail,
    req.files,
    `${req.protocol}://${req.get("host")}`
  );

  // 5) Parse the is topic exist
  //    if not, check if it is leagal
  //    if yes, create it
  let topic;
  if (req.body.topic || req.body.topic === "") {
    topic = await topicHelper.parseTopic(
      req.body.topic,
      req.body.parent,
      req.body.children
    );
  }

  // 5) Normalize the cover path
  let cover;
  if (
    req.files &&
    req.files.cover &&
    !req.files.cover.length &&
    req.files.cover[0].path
  ) {
    cover = normalize(req.files?.cover[0]?.path);
  }

  // 7) Only support English and Chinese
  if (!["en", "ch"].includes(req.body.language))
    return next(new HttpError("Unsupport language", 501));

  // 8) Fill up the post content
  const content = { en: null, ch: null };
  content[req.body.language] = {
    title: req.body.title,
    short: req.body.short,
    detail,
  };

  // 9) update target post
  await postModel.updateOnePost({
    id: post?.id,
    topic_id: topic?.id,
    type: req.body.type,
    cover,
    content,
    tags: req.body.tags
      ? Array.isArray(req.body.tags)
        ? req.body.tags
        : [req.body.tags]
      : req.body.tags,
  });
  next();
});

//----------------Patch--------------------
export const pinPost = catchAsync(async (req, res, next) => {
  // 1) Identify the post
  await postHelper.identifyPost(req.params.id);

  // 2) Identify the query pin
  if (![0, 1].includes(+req.query.pin))
    return next(
      new HttpError("Invalid inputs, please check your input is correct", 500)
    );

  // 3) Update post pin
  await postModel.updatePostPin({ id: req.params.id, pin: +req.query.pin });
  res.status(204).json();
});

//----------------Delete--------------------
export const deleteOnePost = catchAsync(async (req, res, next) => {
  // 1) Identify the post
  const post = await postHelper.identifyPost(req.params.id);

  // 2) Identify the user exist
  const user = await authHelper.identifyUser(req.user.id);

  // 3) Identify the user permission
  if (post.author_id !== req.user.id && !["root"].includes(user.role))
    return next(new HttpError("Permissions deny.", 403));

  // 4) Delete the post
  await queryPool.deleteOne(post_, [id_], [req.params.id]);
  res.status(204).json();
});

export default {
  getOnePost,
  getAllPost,
  getPostSearch,
  createOnePost,
  updateOnePost,
  pinPost,
  deleteOnePost,
};
