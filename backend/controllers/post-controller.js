import User from "../module/user.js";
import Post from "../module/post.js";
import Category from "../module/category.js";
import * as helper from "../utils/helper/helper.js";
import { GetFeatures } from "../utils/api-features.js";
import catchAsync from "../utils/error/catch-async.js";
import * as errorTable from "../utils/error/error-table.js";
import * as postHelper from "../utils/helper/post-helper.js";

export const delay = catchAsync(async (req, res, next) => {
  setTimeout(() => {
    next();
  }, 10000);
});

export const getMe = catchAsync(async (req, res, next) => {
  req.query = {
    ...req.query,
    mode: "author",
    type: "id",
    target: "" + req.user.id,
  };
  next();
});

export const checkPermission = catchAsync(async (req, res, next) => {
  // 1) find post
  let post = await Post.findByPk(req.params.id);
  if (!post) throw errorTable.postNotFound();
  req.post = post;

  // 2) check user permissions
  if (req.user.role === "root") return next();
  postHelper.checkUserUpdatePostPermission(req.user, post);

  next();
});

export const getOne = catchAsync(async (req, res, next) => {
  const post = await postHelper.getFullPost(req.params.id);
  if (!post) throw errorTable.idNotFoundError();

  // increment the number of views
  await post.increment({ views: 1 });

  res.status(200).json({
    status: "success",
    data: post,
  });
});

export const getAllTitle = catchAsync(async (req, res, next) => {
  req.query = {
    fields: "-content,-AuthorId,-previewImg,-summary,-thumbs,-views,-editedAt",
    sort: "-editedAt",
  };
  const getFeature = new GetFeatures(Post, req.query).filter().select();
  const data = await getFeature.findAll({ raw: true });

  const total = await Post.count({ where: req.count });

  res.status(200).json({
    status: "success",
    total,
    count: data.length,
    data,
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  req.query = { sort: "-editedAt" };
  const data = await postHelper.getFullPosts(req.query, req.customQuery);
  const total = await Post.count({ where: req.count });

  res.status(200).json({
    status: "success",
    total,
    count: data.length,
    data,
  });
});

export const getHome = catchAsync(async (req, res, next) => {
  const comments = await postHelper.getFullPosts(
    { limit: 5 },
    postHelper.orderByComments({}, "-Comments")
  );

  const thumbs = await postHelper.getFullPosts(
    { sort: helper.modifySort(null, "thumbs"), limit: 10 },
    {}
  );

  const views = await postHelper.getFullPosts(
    { sort: helper.modifySort(null, "views"), limit: 10 },
    {}
  );

  res.status(200).json({
    status: "success",
    data: {
      comments: {
        count: comments.length,
        data: comments,
      },
      thumbs: {
        count: thumbs.length,
        data: thumbs,
      },
      views: {
        count: views.length,
        data: views,
      },
    },
  });
});

export const getView = catchAsync(async (req, res, next) => {
  req.query.sort = helper.modifySort(req.query.sort, "views");
  const data = await postHelper.getFullPosts(req.query, req.customQuery);

  res.status(200).json({
    status: "success",
    count: data.length,
    data,
  });
});

export const getThumb = catchAsync(async (req, res, next) => {
  req.query.sort = helper.modifySort(req.query.sort, "thumbs");
  const data = await postHelper.getFullPosts(req.query, req.customQuery);

  res.status(200).json({
    status: "success",
    count: data.length,
    data,
  });
});

export const getComment = catchAsync(async (req, res, next) => {
  req.customQuery = postHelper.orderByComments(req.customQuery, "-Comments");
  const data = await postHelper.getFullPosts(req.query, req.customQuery);

  res.status(200).json({
    status: "success",
    count: data.length,
    data,
  });
});

export const createOne = catchAsync(async (req, res, next) => {
  // 1) check Category
  const category = await Category.findByPk(req.body.CategoryId);
  postHelper.checkPostCategory(category);

  // 2) check Tags
  let tags = [];
  if (req.body.tagIds)
    tags = await postHelper.checkAndFindPostTags(req.body.tagIds);

  // 3) create Post
  const post = await postHelper.createPostWithTags({
    title: helper.modeifiedSyntax(req.body.title),
    summary: helper.modeifiedSyntax(req.body.summary),
    content: helper.modeifiedSyntax(req.body.content),
    CategoryId: category.id,
    AuthorId: req.user.id,
    previewImg: req.body.previewImg,
    tags,
  });

  // 4) get Post (Lazy Loading)
  const author = await User.findByPk(post.AuthorId);
  const data = helper.removeKeys(post.toJSON(), ["createdAt", "updatedAt"]);
  if (data.editedAt) data.editedAt = new Date(data.editedAt);

  res.status(200).json({
    status: "success",
    data: { ...data, Author: author, Category: category, Tags: tags },
  });
});

export const updateOne = catchAsync(async (req, res, next) => {
  // 1) check Tag
  let tags = [];
  if (req.body.tagIds)
    tags = await postHelper.checkAndFindPostTags(req.body.tagIds);

  // 2) update Post
  await postHelper.updatePostContentAndTags({
    postId: req.params.id,
    CategoryId: req.body.CategoryId,
    title: helper.modeifiedSyntax(req.body.title),
    summary: helper.modeifiedSyntax(req.body.summary),
    content: helper.modeifiedSyntax(req.body.content),
    isUpdateTags: !!req.body.tagIds,
    tags,
  });

  // 4) get Post (Eager Loading)
  const post = await postHelper.getFullPost(req.params.id);

  res.status(200).json({
    status: "success",
    data: post,
  });
});

export const updateThumb = catchAsync(async (req, res, next) => {
  const mode = req.query.mode;
  // 1) Find the post
  const post = await Post.findByPk(req.params.id);
  if (!post) throw errorTable.idNotFoundError();

  // 2) update post thumbs
  switch (mode) {
    case "dec":
      if (post.thumbs > 0)
        await post.decrement({
          thumbs: 1,
        });
      break;
    default:
      await post.increment({
        thumbs: 1,
      });
  }

  res.status(204).json({});
});

export const updateCategory = catchAsync(async (req, res, next) => {
  let post = req.post;

  // 1) check Category
  const category = await Category.findByPk(req.params.CategoryId);
  postHelper.checkPostCategory(category);

  // 2) update Post Category
  post = await Post.update(
    {
      CategoryId: category.id,
    },
    { where: { id: req.params.id } }
  );

  // 3) get Post (Eager Loading)
  post = await postHelper.getFullPost(req.params.id);

  res.status(200).json({
    status: "success",
    data: post,
  });
});

export const deleteOne = catchAsync(async (req, res, next) => {
  await Post.destroy({ where: { id: req.params.id } });
  res.status(204).json();
});

export const search = catchAsync(async (req, res, next) => {
  let initQuery = {};
  let forceQuery = {};
  const allowType = ["id", "text"];
  const allowMode = ["category", "author", "title", "tag"];

  // 1) check the serch params
  if (!postHelper.isValidSearch(req.query, allowType, allowMode))
    throw errorTable.wrongSearchParamsError();

  // 2) setting the search query for sequelize to get data from database
  [initQuery, forceQuery] = await postHelper.getSearchQuery(
    req.query.mode,
    req.query.type,
    helper.modeifiedSyntax(req.query.target)
  );

  req.query = {
    ...helper.keepKeys(req.query, ["sort", "limit", "page", "fields", "all"]),
    ...initQuery,
  };

  req.customQuery = forceQuery;
  req.count = initQuery;

  next();
});
