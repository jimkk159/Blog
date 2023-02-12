
import { deleteDBPost } from "../../database/mysql/post/delete.js";
import HttpError from "../../models/http-error.js";

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export const deletePost = async (req, res, next) => {
  //For Debug
  console.log("Delete Post");
  const pid = req.params.pid;
  const { uid } = req.userData;
  const targetPost = res.locals.post;
  const admin = res.locals.admin;

  //Check Post Owner
  if (targetPost.author_id !== uid && !admin) {
    const error = new HttpError("Permissions deny.", 403);
    return next(error);
  }

  //Delete Post
  try {
    await deleteDBPost(pid);
  } catch (err) {
    const error = new HttpError(
      "Delete post failed, please try again later.",
      500
    );
    return next(error);
  }

  res.locals.response = { message: `Deleted post id:${req.params.pid}` };
  next();
};
