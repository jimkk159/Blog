import User from "../module/user.js";
import Post from "../module/post.js";
import Category from "../module/category.js";
import catchAsync from "../utils/catch-async.js";
import * as helper from "../utils/helper/helper.js";
import * as errorTable from "../utils/table/error.js";
import * as postHelper from "../utils/helper/post-helper.js";

export const getOne = catchAsync(async (req, res, next) => {
  const post = await postHelper.getFullPost(req.params.id);
  if (!post) throw errorTable.idNotFoundError();

  res.status(200).json({
    status: "success",
    data: post,
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const data = await postHelper.getFullPosts(req.query, req.customQuery);

  res.status(200).json({
    status: "success",
    count: data.length,
    data,
  });
});

export const createOne = catchAsync(async (req, res, next) => {
  // 1) check Category
  const category = await Category.findByPk(req.body.categoryId);
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

  // 3) update Post
  await postHelper.updatePostContentAndTags({
    postId: req.params.id,
    title: req.body.title,
    content: req.body.content,
    isUpdateTags: !!req.body.tagId,
    tags,
  });

  // 4) get Post (Eager Loading)
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
  const category = await Category.findByPk(req.params.categoryId);
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

export const search = catchAsync(async (req, res, next) => {
  let initQuery = {};
  let forceQuery = {};
  // 1) check the serch params
  if (
    !postHelper.isValidSearch(req.query, ["category", "author", "title", "tag"])
  )
    throw errorTable.wrongSearchParamsError();

  // 2) setting the search query for sequelize to get data from database
  switch (req.query.mode) {
    case "category":
      [initQuery, forceQuery] = await postHelper.createCategorySearchQuery(
        req.query.target
      );
      break;
    case "author":
      [initQuery, forceQuery] = await postHelper.createAuthorSearchQuery(
        req.query.target
      );
      break;
    case "title":
      [initQuery, forceQuery] = await postHelper.createTitleySearchQuery(
        req.query.target
      );
      break;
    case "tag":
      [initQuery, forceQuery] = await postHelper.createTagSearchQuery(
        req.query.target
      );
      break;
  }

  req.query = {
    ...helper.keepKeys(req.query, ["sort", "limit", "page"]),
    ...initQuery,
  };
  req.customQuery = forceQuery;
  next();
});
