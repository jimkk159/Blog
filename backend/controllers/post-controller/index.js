import HttpError from "../../models/http-error.js";

import * as create from "./create.js";
import * as read from "./read.js";
import * as update from "./update.js";
import * as deleted from "./delete.js";

export const checkPostAuthor = (req, res, next) => {
  //Find User
  const { uid } = req.userData;
  const post = res.locals.post;

  //Check Post Owner
  if (post.author_id !== uid) {
    const error = new HttpError("Permissions deny.", 403);
    return next(error);
  }
  next();
};

export default {
  ...create,
  ...read,
  ...update,
  ...deleted,
  checkPostAuthor,
};
