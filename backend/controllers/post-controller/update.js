import normalize from "normalize-path";
import {
  updateDBPost,
  updateDBPostPin,
  updateDBPostWithCover,
} from "../../database/mysql/post/update.js";
import HttpError from "../../models/http-error.js";

export const editPost = async (req, res, next) => {
  console.log("Edit Post");
  const { title, language, tags } = req.body;
  const { topic, post: targetPost, contentState } = res.locals;

  //Create New Post
  let coverPath;
  if (
    req?.files?.cover &&
    req?.files?.cover.length > 0 &&
    req?.files?.cover[0]?.path
  ) {
    coverPath = normalize(req.files?.cover[0]?.path);
  }

  //Edit Post
  let editPost;
  let postTag;
  let postCover;
  let postLanguage;
  try {
    postCover = coverPath ? coverPath : null;
    postTag = tags
      ? Array.isArray(tags)
        ? JSON.stringify([...tags])
        : JSON.stringify([tags])
      : JSON.stringify([]);
    const postContent = {
      title,
      support: true,
      short: "bra bra bra",
      contentState,
    };

    postLanguage = JSON.parse(targetPost.language);
    switch (language) {
      case "en":
        postLanguage.en = postContent;
        break;
      case "ch":
        postLanguage.ch = postContent;
        break;
      default:
        const error = new HttpError("Unsupport language", 501);
        return next(error);
    }

    if (postCover) {
      editPost = await updateDBPostWithCover({
        pid: targetPost.id,
        topic_id: topic.id,
        cover: coverPath,
        language: JSON.stringify(postLanguage),
        tags: postTag,
      });
    } else {
      editPost = await updateDBPost({
        pid: targetPost.id,
        topic_id: topic.id,
        language: JSON.stringify(postLanguage),
        tags: postTag,
      });
    }
  } catch (err) {
    const error = new HttpError("Edit Post Failed!", 500);
    return next(error);
  }

  res.locals.response = {
    pid: editPost?.id,
    message: `Create post successfully!`,
  };
  next();
};

export const pinPost = async (req, res, next) => {
  console.log("Pin Post");
  const pid = req.params.pid;
  const queryPin = req.query.pin;
  const admin = res.locals.admin;

  if (!admin) {
    const error = new HttpError("Permissions deny.", 422);
    return next(error);
  }

  //Pin Post
  try {
    await updateDBPostPin({ pid, pin: +queryPin });
  } catch (err) {
    const error = new HttpError(
      "Pin post failed, please try again later.",
      500
    );
    return next(error);
  }

  res.locals.response = { message: `Pin post successfully!` }
  next();
};
