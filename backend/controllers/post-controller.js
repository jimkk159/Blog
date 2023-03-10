import normalize from "normalize-path";
import HttpError from "../utils/http-error.js";
import catchAsync from "../utils/catch-async.js";
import helper from "../utils/helper.js";
import queryPool from "../module/mysql/pool.js";
import postModel from "../module/mysql/post-model.js";

export const identifyAuthor = (req, res, next) => {
  //Check Post Owner
  if (res.locals.post?.author_id !== req.user.id)
    return next(new HttpError("Permissions deny.", 403));

  next();
};

export const identifyPost = catchAsync(async (req, res, next) => {
  let post = await queryPool.getOne(`post`, "id", req.params.id);
  //Post not find
  if (!post) return next(new HttpError("Post not Find!", 404));
  res.locals.post = post;
  res.locals.response = { status: "success", result: true };
  next();
});

export const judeDeletePostPermission =
  (...roles) =>
  (req, res, next) => {
    if (
      res.locals.post?.author_id !== req.user.id &&
      !roles.includes(req.user.role)
    )
      return next(new HttpError("Permissions deny.", 403));
    next();
  };

//-----------------Get---------------------
export const getOnePost = catchAsync(async (req, res, next) => {
  let post = await postModel.getOnePost(req.params.id);
  //Post not find
  if (!post) return next(new HttpError("Post not Find!", 404));

  //Restruct the post
  post = helper.restructPost(post);

  res.locals.post = post;
  res.locals.response = res.locals.post;
  next();
});

export const getAllPost = catchAsync(async (req, res, next) => {
  let posts = await postModel.getAllPost(req.query);

  //Restruct the posts obj
  posts = posts.map((elemnt) => helper.restructPost(elemnt));

  res.locals.posts = posts;
  res.locals.response = {
    status: "success",
    results: posts.length,
    data: {
      posts,
    },
  };
  next();
});

export const getPostByIds = catchAsync(async (req, res, next) => {
  const vals = req.query.ids.split(",").map(Number);
  const posts = await postModel.getManyPostByKeys({ key: "id", vals });
  res.locals.posts = posts;
  res.locals.response = res.locals.posts;
  next();
});

export const getTopicRelatedPost = catchAsync(async (req, res, next) => {
  const post = res.locals.post;
  if (!post) return next(new HttpError("Post not Find!", 404));

  if (!res.locals.post?.related || !Array.isArray(res.locals.post?.related)) {
    res.locals.post.related = [];
  }

  let related = [...res.locals.post.related];
  const relatedLimit = +req.body.limit || 5;
  const limit = relatedLimit + 2;

  //Find Related Topic
  if (limit > related.length) {
    related = [
      ...related,
      ...(await postModel.getAllPost({ topic_id: post.topic_id, limit })) //Get Related Posts
        .map((elemnt) => helper.restructPost(elemnt)), //Restruct Post
    ];
    related =
      helper
        .removeDuplicatesById(related)
        .filter((element) => element.id !== post.id)
        .slice(0, relatedLimit) ?? [];

    res.locals.post = {
      ...post,
      related,
    };
    res.locals.response = res.locals.post;
  }

  next();
});

export const getTagRelatedPost = catchAsync(async (req, res, next) => {
  const post = res.locals.post;
  if (!post) return next(new HttpError("Post not Find!", 404));

  if (!res.locals.post?.related || !Array.isArray(res.locals.post?.related)) {
    res.locals.post.related = [];
  }

  let related = [...res.locals.post.related];
  const tag = "`tag`";
  const relatedLimit = +req.body.limit || 5;
  const limit = relatedLimit + 2;

  //Find Related Topic
  if (limit > related.length && post?.tags.length > 0) {
    related = [
      ...related,
      ...(
        await postModel.getAllPost({
          [`${tag}.${tag}`]: post.tags.join(","),
          limit,
        })
      ) //Get Related Posts
        .map((elemnt) => helper.restructPost(elemnt)), //Restruct Post
    ];

    related =
      helper
        .removeDuplicatesById(related)
        .filter((element) => element.id !== post.id)
        .slice(0, relatedLimit) ?? [];

    res.locals.post = {
      ...post,
      related,
    };
    res.locals.response = res.locals.post;
  }

  next();
});

export const getAuthorRelatedPost = catchAsync(async (req, res, next) => {
  const post = res.locals.post;
  if (!post) return next(new HttpError("Post not Find!", 404));

  if (!res.locals.post?.related || !Array.isArray(res.locals.post?.related)) {
    res.locals.post.related = [];
  }

  let related = [...res.locals.post?.related];
  const relatedLimit = +req.body.limit || 5;
  const limit = relatedLimit + 2;

  //Find Related Author
  if (limit > related.length) {
    related = [
      ...related,
      ...(await postModel.getAllPost({ author_id: post.author_id, limit })) //Get Related Posts
        .map((elemnt) => helper.restructPost(elemnt)), //Restruct Post
    ];

    related =
      helper
        .removeDuplicatesById(related)
        .filter((element) => element.id !== post.id)
        .slice(0, relatedLimit) ?? [];

    res.locals.post = {
      ...post,
      related,
    };
    res.locals.response = res.locals.post;
  }
  next();
});

export const getPostSearch = catchAsync(async (req, res, next) => {
  const limit = +req.body.limit || 5;

  let posts = (await postModel.getSearchPost(req.query.search, limit)) ?? [];

  //Restruct the posts obj
  posts = posts.map((elemnt) => helper.restructPost(elemnt));

  res.locals.posts = posts;
  res.locals.response = res.locals.posts;
  next();
});

//-----------------Post---------------------
export const createOnePost = catchAsync(async (req, res, next) => {
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
    detail: res.locals.detail,
  };

  //New Post Id
  req.params.id = await postModel.createOnePost({
    author_id: req.user.id,
    topic_id: res.locals.topic.id,
    type: req.body.type,
    cover,
    content,
    tags: Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags],
  });

  next();
});

//-----------------Put---------------------
export const updateOnePost = catchAsync(async (req, res, next) => {
  //Edit Post
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
    detail: res.locals.detail,
  };
  await postModel.updateOnePost({
    id: res.locals.post?.id,
    topic_id: res.locals.topic?.id,
    type: req.body.type,
    cover,
    content,
    tags: req.body.tags
      ? Array.isArray(req.body.tags)
        ? req.body.tags
        : [req.body.tags]
      : req.body.tags,
  });

  //Edit Post Id
  req.params.id = res.locals.post?.id;
  next();
});

//----------------Patch--------------------
export const pinPost = catchAsync(async (req, res, next) => {
  if (![0, 1].includes(+req.query.pin))
    return next(
      new HttpError("Invalid inputs, please check your input is correct", 500)
    );
  //Pin Post
  await postModel.updatePostPin({ id: req.params.id, pin: +req.query.pin });
  res.status(204).json();
});

export default {
  identifyPost,
  identifyAuthor,
  judeDeletePostPermission,
  getOnePost,
  getAllPost,
  getPostByIds,
  getPostByIds,
  getTopicRelatedPost,
  getTagRelatedPost,
  getAuthorRelatedPost,
  getPostSearch,
  createOnePost,
  updateOnePost,
  pinPost,
};
