import normalize from "normalize-path";
import {
  updateDBPost,
  updateDBPostPin,
} from "../../database/mysql/post/update.js";
import HttpError from "../../models/http-error.js";

export const editPost = async (req, res, next) => {
  console.log("Edit Post");
  const { language, type, title, short, tags } = req.body;
  const { topic, post, content } = res.locals;

  //Edit Post
  let editPost;
  let coverPath;
  let tagsArray;
  try {
    if (
      req?.files?.cover &&
      req?.files?.cover.length > 0 &&
      req?.files?.cover[0]?.path
    ) {
      coverPath = normalize(req.files?.cover[0]?.path);
    }

    if (!tags) tagsArray = [];
    else if (!Array.isArray(tags)) {
      tagsArray = [tags];
    } else tagsArray = tags;

    const postContent = { en: null, ch: null };
    switch (language) {
      case "en":
        postContent.en = { title, short, content };
        break;
      case "ch":
        postContent.ch = { title, short, content };
        break;
      default:
        const error = new HttpError("Unsupport language", 501);
        return next(error);
    }

    editPost = await updateDBPost({
      id: post.id,
      topic_id: topic.id,
      type,
      cover: coverPath,
      content: postContent,
      tags: tagsArray,
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Edit Post Failed!", 500);
    return next(error);
  }

  res.locals.response = {
    pid: post?.id,
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

  res.locals.response = { message: `Pin post successfully!` };
  next();
};
