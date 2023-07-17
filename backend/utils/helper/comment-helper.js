import * as cacheHelper from "./cache-helper.js";
import * as commentHelper from "./comment-helper.js";
import * as errorTable from "../error/error-table.js";

export const isUserAllowUpdatePost = (user, comment) =>
  user.role === "root" || user.id === comment.AuthorId;

export const checkUserUpdateCommentPermission = (user, comment) => {
  if (!commentHelper.isUserAllowUpdatePost(user, comment))
    throw errorTable.permissionDenyError();
};

export const removeCreatedCommentCache = async (url) => {
  const postURL = url.replace("/comments", "");

  await cacheHelper.delKey(process.env.APP_BASE_ROUTE + "/comments");
  await cacheHelper.delCache(postURL); // also update post cache
};

export const removeUpdatedCommentCache = async (postId, commentId) => {
  await cacheHelper.delKey(process.env.APP_BASE_ROUTE + "/comments");

  if (postId)
    await cacheHelper.delKey(process.env.APP_BASE_ROUTE + "/posts/" + postId);

  if (commentId)
    await cacheHelper.delKey(
      process.env.APP_BASE_ROUTE + "/comments/" + commentId
    );
};
