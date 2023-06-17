import User from "../module/user.js";
import Post from "../module/post.js";
import Category from "../module/category.js";
import * as helper from "../utils/helper/helper.js";
import { GetFeatures } from "../utils/api-features.js";
import catchAsync from "../utils/error/catch-async.js";
import * as errorTable from "../utils/error/error-table.js";
import * as postHelper from "../utils/helper/post-helper.js";
import * as apiFeatureHelper from "../utils/helper/api-feature-helper.js";

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

  res.status(200).json({
    status: "success",
    data: post,
  });
});

export const getAllTitle = catchAsync(async (req, res, next) => {
  req.query = { fields: "-content,-AuthorId" };
  const getFeature = new GetFeatures(Post, req.query).select();
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
  const data = await postHelper.getFullPosts(req.query, req.customQuery);
  const total = await Post.count({ where: req.count });

  res.status(200).json({
    status: "success",
    total,
    count: data.length,
    data,
  });
});

export const getView = catchAsync(async (req, res, next) => {
  const data = await postHelper.getFullPosts(req.query, req.customQuery);
  const total = await Post.count({ where: req.count });

  res.status(200).json({
    status: "success",
    total,
    count: data.length,
    data,
  });
});

export const getThumb = catchAsync(async (req, res, next) => {
  req.query.sort = [
    "thumbs",
    ...apiFeatureHelper.getQueryElements(req.query.sort),
  ].join(",");
  const data = await postHelper.getFullPosts(req.query, req.customQuery);

  res.status(200).json({
    status: "success",
    count: data.length,
    data,
  });
});

export const getComment = catchAsync(async (req, res, next) => {
  const data = await postHelper.getFullPosts(req.query, req.customQuery);
  const total = await Post.count({ where: req.count });

  res.status(200).json({
    status: "success",
    total,
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
    title: helper.modifySyntax(req.body.title),
    summary: helper.modifySyntax(req.body.summary),
    content: helper.modifySyntax(req.body.content),
    CategoryId: category.id,
    AuthorId: req.user.id,
    previewImg: req.body.previewImg,
    tags,
  });

  // 4) get Post (Lazy Loading)
  const author = await User.findByPk(post.AuthorId);
  const data = helper.removeKeys(post.toJSON(), ["createdAt"]);

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

  // 2) Modify the tags syntax
  if (tags.length) tags = tags.map((el) => helper.modifySyntax(el));

  // 3) update Post
  await postHelper.updatePostContentAndTags({
    postId: req.params.id,
    CategoryId: req.body.CategoryId,
    title: helper.modifySyntax(req.body.title),
    summary: helper.modifySyntax(req.body.summary),
    content: helper.modifySyntax(req.body.content),
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
    helper.modifySyntax(req.query.target)
  );

  req.query = {
    ...helper.keepKeys(req.query, ["sort", "limit", "page", "fields", "all"]),
    ...initQuery,
  };

  req.customQuery = forceQuery;
  req.count = initQuery;

  next();
});
