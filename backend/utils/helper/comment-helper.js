import * as commentHelper from "./comment-helper.js";
import * as errorTable from "../error/error-table.js";

export const isUserAllowUpdatePost = (user, comment) =>
  user.role === "root" || user.id === comment.AuthorId;

export const checkUserUpdateCommentPermission = (user, comment) => {
  if (!commentHelper.isUserAllowUpdatePost(user, comment))
    throw errorTable.permissionDenyError();
};
