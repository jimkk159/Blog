import normalize from "normalize-path";
import HttpError from "../utils/http-error.js";
import catchAsync from "../utils/catch-async.js";
import helper from "../utils/helper.js";
import queryPool from "../module/mysql/pool.js";
import postModel from "../module/mysql/post-model.js";
import authController from "./auth-controller.js";
import topicController from "./topic-controller.js";
import shareController from "./share-controller.js";
import topicModel from "../module/mysql/topic-model.js";
import factory from "./handle-factory.js";
import { id_, post_ } from "../utils/table.js";

export const identifyAuthor = (post, uid) => {
  //Check Post Owner
  if (post?.author_id !== uid) throw new HttpError("Permissions deny.", 403);
};

export const identifyPost = async (pid) => {
  const post = await queryPool.getOne(`post`, "id", pid);
  //Post not find
  if (!post) throw new HttpError("Post not Find!", 404);
  return post;
};

export const removePostDuplicate = (originId, related, limit) => {
  return (
    helper
      .removeDuplicatesById(related)
      .filter((element) => element.id !== originId)
      .slice(0, limit) ?? []
  );
};

export const getTopicRelatedPost = async (post, limit) => {
  if (!post?.related || !Array.isArray(post?.related)) {
    post.related = [];
  }

  let related = [...post.related];
  const relatedLimit = +limit || 5;

  //Find Related Topic
  if (limit > related.length) {
    related = [
      ...related,
      ...(
        await postModel.getAllPost({
          topic_id: post.topic_id,
          limit: relatedLimit + 2,
        })
      ) //Get Related Posts
        .map((elemnt) => helper.restructPost(elemnt)), //Restruct Post
    ];

    related = removePostDuplicate(post.id, related, relatedLimit + 2);
    return {
      ...post,
      related,
    };
  }
  return post;
};

export const getTagRelatedPost = async (post, limit) => {
  if (!post?.related || !Array.isArray(post?.related)) {
    post.related = [];
  }

  let related = [...post.related];
  const tag = "`tag`";
  const relatedLimit = +limit || 5;

  //Find Related Topic
  if (limit > related.length && post?.tags.length > 0) {
    related = [
      ...related,
      ...(
        await postModel.getAllPost({
          [`${tag}.${tag}`]: post.tags.join(","),
          limit: relatedLimit + 2,
        })
      ) //Get Related Posts
        .map((elemnt) => helper.restructPost(elemnt)), //Restruct Post
    ];

    related = removePostDuplicate(post.id, related, relatedLimit + 2);
    return {
      ...post,
      related,
    };
  }
  return post;
};

export const getAuthorRelatedPost = async (post, limit) => {
  if (!post?.related || !Array.isArray(post?.related)) {
    post.related = [];
  }

  let related = [...post?.related];
  const relatedLimit = +limit || 5;

  //Find Related Author
  if (limit > related.length) {
    related = [
      ...related,
      ...(
        await postModel.getAllPost({
          author_id: post?.author_id,
          limit: relatedLimit + 2,
        })
      ) //Get Related Posts
        .map((elemnt) => helper.restructPost(elemnt)), //Restruct Post
    ];

    related = removePostDuplicate(post.id, related, relatedLimit + 2);
    return {
      ...post,
      related,
    };
  }
  return post;
};

//-----------------Get---------------------
export const getOnePost = catchAsync(async (req, res, next) => {
  let post = await postModel.getOnePost(req.params.id);

  //Post not find
  if (!post) return next(new HttpError("Post not Find!", 404));

  //Restruct the post
  post = helper.restructPost(post);
  if (!post?.related || !Array.isArray(post?.related)) post.related = [];

  post = await getTopicRelatedPost(post, 5);
  post = await getTagRelatedPost(post, 5);
  post = await getAuthorRelatedPost(post, 5);

  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
});

export const getAllPost = catchAsync(async (req, res, next) => {
  let posts = await postModel.getAllPost(req.query);

  //Restruct the posts obj
  posts = posts.map((elemnt) => helper.restructPost(elemnt));
  res.status(200).json({
    status: "success",
    results: posts.length,
    data: {
      posts,
    },
  });
});

export const getPostByIds = catchAsync(async (req, res, next) => {
  const vals = req.query.ids.split(",").map(Number);
  const posts = await postModel.getManyPostByKeys({ key: "id", vals });
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

  let posts = (await postModel.getSearchPost(req.query.search, limit)) ?? [];

  //Restruct the posts obj
  posts = posts.map((elemnt) => helper.restructPost(elemnt));
  res.status(200).json(posts);
});

//-----------------Post---------------------
export const createOnePost = catchAsync(async (req, res, next) => {
  await authController.identifyUser(req.user.id);
  let topic = await topicController.identifyTopic(
    req.body.topic,
    req.body.parent,
    req.body.children
  );

  if (!topic.exist) {
    topic = await topicModel.createOneTopic({ ...topic });
  }

  const detail = shareController.replaceImageSrc(
    req.body.map,
    req.body.detail,
    req.files,
    `${req.protocol}://${req.get("host")}`
  );

  //Create New Post
  let cover;
  if (
    req.files &&
    req.files.cover &&
    !req.files.cover.length &&
    req.files.cover[0].path
  ) {
    cover = normalize(req.files?.cover[0]?.path);
  }

  //Only support English and Chinese
  if (!["en", "ch"].includes(req.body.language))
    return next(new HttpError("Unsupport language", 501));

  const content = { en: null, ch: null };
  content[req.body.language] = {
    title: req.body.title,
    short: req.body.short,
    detail,
  };

  //New Post Id
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
  const post = await identifyPost(req.params.id);
  await authController.identifyUser(req.user.id);
  identifyAuthor(post, req.user.id);

  const detail = shareController.replaceImageSrc(
    req.body.map,
    req.body.detail,
    req.files,
    `${req.protocol}://${req.get("host")}`
  );

  let topic;
  if (req.body.topic || req.body.topic === "") {
    topic = await topicController.parseTopic(
      req.body.topic,
      req.body.parent,
      req.body.children
    );
  }

  // Edit Post
  let cover;
  if (
    req.files &&
    req.files.cover &&
    !req.files.cover.length &&
    req.files.cover[0].path
  ) {
    cover = normalize(req.files?.cover[0]?.path);
  }

  //Only support English and Chinese
  if (!["en", "ch"].includes(req.body.language))
    return next(new HttpError("Unsupport language", 501));

  const content = { en: null, ch: null };
  content[req.body.language] = {
    title: req.body.title,
    short: req.body.short,
    detail,
  };

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
  await identifyPost(req.params.id);
  if (![0, 1].includes(+req.query.pin))
    return next(
      new HttpError("Invalid inputs, please check your input is correct", 500)
    );
  //Pin Post
  await postModel.updatePostPin({ id: req.params.id, pin: +req.query.pin });
  res.status(204).json();
});

//----------------Delete--------------------
export const deleteOnePost = catchAsync(async (req, res, next) => {
  const post = await identifyPost(req.params.id);
  const user = await authController.identifyUser(req.user.id);
  if (post.author_id !== req.user.id && !["root", "leader"].includes(user.role))
    return next(new HttpError("Permissions deny.", 403));

  await queryPool.deleteOne(post_, [id_], [req.params.id]);
  res.status(204).json();
});

export default {
  identifyPost,
  identifyAuthor,
  getOnePost,
  getAllPost,
  getPostByIds,
  getTopicRelatedPost,
  getTagRelatedPost,
  getAuthorRelatedPost,
  getPostSearch,
  createOnePost,
  updateOnePost,
  pinPost,
  deleteOnePost,
};
