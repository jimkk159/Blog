import HttpError from "../../models/http-error.js";

export * from "./addAuthor.js";
export * from "./create.js";
export * from "./read.js";
export * from "./update.js";
export * from "./delete.js";

export const checkPostAuthor = (req, res, next) => {
  //Find User
  const { uid } = req.userData;
  const targetPost = res.locals.post;

  //Check Post Owner
  if (targetPost.author_id !== uid) {
    const error = new HttpError("Permissions deny.", 403);
    return next(error);
  }
  next();
};
