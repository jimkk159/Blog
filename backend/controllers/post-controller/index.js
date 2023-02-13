import HttpError from "../../models/http-error.js";

export * from "./create.js";
export * from "./read.js";
export * from "./update.js";
export * from "./delete.js";

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
