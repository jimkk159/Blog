import { Op } from "sequelize";
import Tag from "../../module/tag.js";
import Post from "../../module/post.js";
import sequelize from "../../config/db-init.js";
import * as errorTable from "../error/error-table.js";
import { GetFeatures } from "../api-features.js";
import * as tagHelper from "../helper/tag-helper.js";
import * as postHelper from "../helper/post-helper.js";
import * as categoryHelper from "../helper/category-helper.js";
import Category from "../../module/category.js";
import * as helper from "../helper/helper.js";
import User from "../../module/user.js";

export const isValidSearch = (query, allowType, allowMode) =>
  query.mode &&
  query.type &&
  query.target &&
  Array.isArray(allowType) &&
  Array.isArray(allowMode) &&
  allowType.includes(query.type) &&
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
      {
        model: User,
        as: "Author",
        attributes: {
          exclude: [
            "description",
            "email",
            "role",
            "createdAt",
            "updatedAt",
            "updatePasswordAt",
            "isEmailValidated",
          ],
        },
      },
      "Category",
      { model: Tag, through: { attributes: [] } },
    ],
    ...customQuery,
  };

  let posts = await getFeature.findAll(forceQuery);
  posts = posts
    .map((el) => el.toJSON())
    .map((el) => {
      el.Author.avatar = helper.getImgUrlFromS3(el.Author.avatar);
      return el;
    });
  return posts;
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
  CategoryId,
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
        CategoryId,
      },
      { where: { id: postId }, transaction: t }
    );
    if (isUpdateTags) await post.setTags(tags, { transaction: t });
  });
};

export const getCategorySearchQueryByText = async (target) => {
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

export const getAuthorSearchQueryByText = async (target) => {
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

export const getTitleySearchQueryByText = async (target) => {
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

export const getTagSearchQueryByText = async (target) => {
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

export const getSearchQueryById = (mode, target) => {
  switch (mode) {
    case "category":
      return [{ CategoryId: target }, {}];

    case "author":
      return [{ AuthorId: target }, {}];

    case "tag":
      return [
        {},
        {
          include: [
            "Author",
            "Category",
            {
              model: Tag,
              where: { id: target },
              through: { attributes: [] },
            },
          ],
        },
      ];
  }
};

export const getSearchQueryByText = async (mode, target) => {
  switch (mode) {
    case "category":
      return getCategorySearchQueryByText(target);

    case "author":
      return getAuthorSearchQueryByText(target);

    case "title":
      return getTitleySearchQueryByText(target);

    case "tag":
      return getTagSearchQueryByText(target);
  }
};

export const getSearchQuery = async (mode, type, target) => {
  if (type === "id") return getSearchQueryById(mode, target);
  return getSearchQueryByText(mode, target);
};
