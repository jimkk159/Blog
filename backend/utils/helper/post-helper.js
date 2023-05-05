import { Op } from "sequelize";
import Tag from "../../module/tag.js";
import Post from "../../module/post.js";
import sequelize from "../../config/db-init.js";
import * as errorTable from "../table/error.js";
import { GetFeatures } from "../api-features.js";
import * as tagHelper from "../helper/tag-helper.js";
import * as postHelper from "../helper/post-helper.js";
import * as categoryHelper from "../helper/category-helper.js";
import Category from "../../module/category.js";
import User from "../../module/user.js";

export const isValidSearch = (query, allowMode) =>
  query.mode &&
  query.target &&
  Array.isArray(allowMode) &&
  allowMode.includes(query.mode);

export const isUserAllowUpdatePost = (user, post) =>
  user.role === "root" || user.id === post.AuthorId;

export const getFullPost = async (postId) =>
  Post.findByPk(postId, {
    include: [
      "Author",
      "Category",
      { model: Tag, through: { attributes: [] } },
    ],
  });

export const getFullPosts = async (query, customQuery = {}) => {
  const getFeature = new GetFeatures(Post, query)
    .filter()
    .sort()
    .select()
    .paginate();

  const forceQuery = {
    include: [
      "Author",
      "Category",
      { model: Tag, through: { attributes: [] } },
    ],
    ...customQuery,
  };
  return getFeature.findAll(forceQuery);
};

export const checkPostCategory = (category) => {
  if (!category) throw errorTable.categoryNotFound();
  if (categoryHelper.isRoot(category))
    throw errorTable.notAllowChoiceRootError();
};

export const checkAndFindPostTags = async (tagId) => {
  if (!tagHelper.isTagIdLegal(tagId))
    throw errorTable.inputInvalidError("tagId");

  const tags = await Tag.findAll({
    where: {
      id: tagId,
    },
  });
  tagHelper.checkTagsConsistency(tags, tagId);
  return tags;
};

export const createPostWithTags = async ({
  title,
  content,
  CategoryId,
  AuthorId,
  tags,
}) => {
  let post;

  await sequelize.transaction(async (t) => {
    post = await Post.create(
      {
        title,
        content,
        CategoryId,
        AuthorId,
      },
      { transaction: t }
    );
    await post.addTags(tags, { transaction: t });
  });

  return post;
};

export const checkUserUpdatePostPermission = (user, post) => {
  if (!post) throw errorTable.postNotFound();
  if (!postHelper.isUserAllowUpdatePost(user, post))
    throw errorTable.permissionDenyError();
};

export const updatePostContentAndTags = async ({
  postId,
  title,
  content,
  isUpdateTags,
  tags,
}) => {
  const post = await Post.findByPk(postId);
  await sequelize.transaction(async (t) => {
    await Post.update(
      {
        title,
        content,
      },
      { where: { id: postId }, transaction: t }
    );
    if (isUpdateTags) await post.setTags(tags, { transaction: t });
  });
};

export const createCategorySearchQuery = async (target) => {
  let initQuery = {};
  let forceQuery = {};

  // Get the target category
  const categories = await Category.findAll({
    where: {
      name: {
        [Op.like]: `%${target}%`,
      },
    },
  });
  initQuery = {
    CategoryId: categories.map((category) => category.id),
  };

  return [initQuery, forceQuery];
};

export const createAuthorSearchQuery = async (target) => {
  let initQuery = {};
  let forceQuery = {};

  // Get the target user
  const authors = await User.findAll({
    where: {
      name: {
        [Op.like]: `%${target}%`,
      },
    },
  });
  initQuery = {
    AuthorId: authors.map((author) => author.id),
  };

  return [initQuery, forceQuery];
};

export const createTitleySearchQuery = async (target) => {
  let initQuery = {};
  let forceQuery = {};

  // Get the target title
  forceQuery = {
    where: {
      title: {
        [Op.like]: `%${target}%`,
      },
    },
  };
  return [initQuery, forceQuery];
};

export const createTagSearchQuery = async (target) => {
  let initQuery = {};
  let forceQuery = {};

  const tags = await Tag.findAll({
    where: {
      name: {
        [Op.like]: `%${target}%`,
      },
    },
  });

  // Get the target tags
  forceQuery = {
    include: [
      "Author",
      "Category",
      {
        model: Tag,
        where: { id: tags.map((tag) => tag.id) },
        through: { attributes: [] },
      },
    ],
  };
  return [initQuery, forceQuery];
};
