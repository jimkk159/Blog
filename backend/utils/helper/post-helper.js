import { Op } from "sequelize";
import Tag from "../../module/tag.js";
import User from "../../module/user.js";
import Post from "../../module/post.js";
import Comment from "../../module/comment.js";
import Category from "../../module/category.js";
import sequelize from "../../config/db-init.js";
import * as errorTable from "../error/error-table.js";
import { GetFeatures } from "../api-features.js";
import * as helper from "../helper/helper.js";
import * as tagHelper from "../helper/tag-helper.js";
import * as postHelper from "../helper/post-helper.js";
import * as categoryHelper from "../helper/category-helper.js";

export const isValidSearch = (query, allowType, allowMode) =>
  !!(
    query.mode &&
    query.type &&
    query.target &&
    Array.isArray(allowType) &&
    Array.isArray(allowMode) &&
    allowType.includes(query.type) &&
    allowMode.includes(query.mode)
  );

export const isUserAllowUpdatePost = (user, post) =>
  user.role === "root" || user.id === post.AuthorId;

export const getFullPost = async (postId) =>
  Post.findByPk(postId, {
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
      { model: Comment },
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
      { model: Comment },
      { model: Tag, through: { attributes: [] } },
    ],
    ...customQuery,
  };

  let posts = await getFeature.findAll(forceQuery);
  
  posts = posts
    .map((el) => el.toJSON())
    .map((el) => {
      if (el.Author && el.Author.avatar && !helper.isURL(el.Author.avatar))
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

export const checkAndFindPostTags = async (tagIds) => {
  if (!tagHelper.isTagIdLegal(tagIds))
    throw errorTable.inputInvalidError("tagIds");

  const tags = await Tag.findAll({
    where: {
      id: tagIds,
    },
  });
  tagHelper.checkTagsConsistency(tags, tagIds);
  return tags;
};

export const createPostWithTags = async ({
  title,
  summary,
  content,
  CategoryId,
  AuthorId,
  previewImg,
  tags,
}) => {
  let post;

  await sequelize.transaction(async (t) => {
    post = await Post.create(
      {
        title,
        summary,
        content,
        CategoryId,
        previewImg,
        AuthorId,
      },
      { transaction: t }
    );
    await post.addTags(tags, { transaction: t });
  });

  return post;
};

export const checkUserUpdatePostPermission = (user, post) => {
  if (!postHelper.isUserAllowUpdatePost(user, post))
    throw errorTable.permissionDenyError();
};

export const updatePostContentAndTags = async ({
  postId,
  CategoryId,
  title,
  summary,
  content,
  isUpdateTags,
  tags,
}) => {
  const post = await Post.findByPk(postId);
  if (!post) throw errorTable.idNotFoundError();

  await sequelize.transaction(async (t) => {
    await Post.update(
      {
        title,
        summary,
        content,
        CategoryId,
        editedAt: Date.now(),
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
  const tags = await Tag.findAll({
    where: {
      name: {
        [Op.like]: `%${target}%`,
      },
    },
  });

  const getFeature = new GetFeatures(Post, { sort: "-editedAt" })
    .filter()
    .sort()
    .select()
    .paginate();

  const posts = await getFeature.findAll({
    include: [
      {
        model: Tag,
        where: { id: tags.map((tag) => tag.id) },
        through: { attributes: [] },
      },
    ],
    raw: true,
  });
  const targetIds = posts.map((el) => el.id);
  return [{}, { where: { id: { [Op.in]: targetIds } } }];
};

export const getSearchQueryById = async (mode, target) => {
  switch (mode) {
    case "category":
      return [{ CategoryId: target }, {}];

    case "author":
      return [{ AuthorId: target }, {}];

    case "tag":
      // The reason why for query two time is searching for tag will not return the complete tag inside the post
      const getFeature = new GetFeatures(Post, { sort: "-editedAt" })
        .filter()
        .sort()
        .select()
        .paginate();

      const posts = await getFeature.findAll({
        include: [
          {
            model: Tag,
            where: { id: target },
            through: { attributes: [] },
          },
        ],
        raw: true,
      });
      const targetIds = posts.map((el) => el.id);
      return [{}, { where: { id: { [Op.in]: targetIds } } }];
  }
};

export const getSearchQueryByText = async (mode, target) => {
  switch (mode) {
    case "category":
      return postHelper.getCategorySearchQueryByText(target);

    case "author":
      return postHelper.getAuthorSearchQueryByText(target);

    case "title":
      return postHelper.getTitleySearchQueryByText(target);

    case "tag":
      return postHelper.getTagSearchQueryByText(target);
  }
};

export const getSearchQuery = async (mode, type, target) => {
  if (type === "id") return postHelper.getSearchQueryById(mode, target);
  return postHelper.getSearchQueryByText(mode, target);
};

export const orderByComments = (query, target) => {
  if (!query && !target) return query;
  if (!target) return query;
  if (typeof query === "object" && Object.keys(query).includes(target))
    return query;

  const output = {
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
      { model: Comment },
      { model: Tag, through: { attributes: [] } },
    ],
    attributes: [
      "id",
      "previewImg",
      "title",
      "content",
      "thumbs",
      "views",
      "editedAt",
      [
        sequelize.literal(
          "(SELECT COUNT(*) FROM Comments WHERE Comments.postId = Post.id)"
        ),
        "commentCount",
      ],
    ],
  };

  if (target.includes("-"))
    output.order = [[sequelize.literal("commentCount"), "DESC"]];
  else output.order = [[sequelize.literal("commentCount"), "ASC"]];

  if (query)
    return {
      ...query,
      ...output,
    };
  return output;
};
