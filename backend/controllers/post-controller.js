import User from "../module/user.js";
import Post from "../module/post.js";
import * as s3 from "../utils/aws/s3.js";
import Category from "../module/category.js";
import * as helper from "../utils/helper/helper.js";
import { GetFeatures } from "../utils/api-features.js";
import catchAsync from "../utils/error/catch-async.js";
import * as errorTable from "../utils/error/error-table.js";
import * as postHelper from "../utils/helper/post-helper.js";

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

export const createOne = catchAsync(async (req, res, next) => {
  // 1) check Category
  const category = await Category.findByPk(req.body.CategoryId);
  postHelper.checkPostCategory(category);

  // 2) check Tag
  let tags = [];
  if (req.body.tagId)
    tags = await postHelper.checkAndFindPostTags(req.body.tagId);

  // 3) create Post
  const post = await postHelper.createPostWithTags({
    title: req.body.title,
    content: req.body.content,
    CategoryId: category.id,
    AuthorId: req.user.id,
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
  // 1) check user permissions
  let post = await Post.findByPk(req.params.id);
  postHelper.checkUserUpdatePostPermission(req.user, post);

  // 2) check Tag
  let tags = [];
  if (req.body.tagId)
    tags = await postHelper.checkAndFindPostTags(req.body.tagId);

  // 3) Modify the img url to file name
  if (req.body.content)
    req.body.content = req.body.content.replaceAll("&lt;", "<");

  // 4) update Post
  await postHelper.updatePostContentAndTags({
    postId: req.params.id,
    title: req.body.title,
    CategoryId: req.body.CategoryId,
    content: req.body.content,
    isUpdateTags: !!req.body.tagId,
    tags,
  });

  // 5) get Post (Eager Loading)
  post = await postHelper.getFullPost(req.params.id);

  res.status(200).json({
    status: "success",
    data: post,
  });
});

export const updateCategory = catchAsync(async (req, res, next) => {
  // 1) check user permissions
  let post = await Post.findByPk(req.params.id);
  postHelper.checkUserUpdatePostPermission(req.user, post);

  // 2) check Category
  const category = await Category.findByPk(req.params.CategoryId);
  postHelper.checkPostCategory(category);

  // 3) update Post Category
  post = await Post.update(
    {
      CategoryId: category.id,
    },
    { where: { id: req.params.id } }
  );

  // 4) get Post (Eager Loading)
  post = await postHelper.getFullPost(req.params.id);

  res.status(200).json({
    status: "success",
    data: post,
  });
});

export const deleteOne = catchAsync(async (req, res, next) => {
  // 1) check user permissions
  let post = await Post.findByPk(req.params.id);
  postHelper.checkUserUpdatePostPermission(req.user, post);

  // 2) delete Post
  await Post.destroy({ where: { id: req.params.id } });
  res.status(204).json();
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
    req.query.target
  );

  req.query = {
    ...helper.keepKeys(req.query, ["sort", "limit", "page", "fields", "all"]),
    ...initQuery,
  };

  req.customQuery = forceQuery;
  req.count = initQuery;

  next();
});

export const updateImage = catchAsync(async (req, res, next) => {
  let img;
  if (req.file) {
    img = await s3.uploadToS3(req.file);
    img = helper.getImgUrlFromS3(img);
  }

  res.status(200).json({
    status: "success",
    data: {
      img,
    },
  });
});