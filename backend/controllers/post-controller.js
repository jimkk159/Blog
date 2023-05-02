import User from "../module/user.js";
import Post from "../module/post.js";
import Category from "../module/category.js";
import catchAsync from "../utils/catch-async.js";
import * as helper from "../utils/helper/helper.js";
import * as errorTable from "../utils/error/errorTable.js";
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
  const data = await postHelper.getFullPosts(req.query);

  res.status(200).json({
    status: "success",
    count: data.count,
    data: data.rows,
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
  const data = helper.removeExclude(post.toJSON(), ["createdAt"]);

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
  if (req.body.tagId) tags = postHelper.checkAndFindPostTags(req.body.tagId);

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
