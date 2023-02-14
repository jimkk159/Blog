import normalize from "normalize-path";
import HttpError from "../../models/http-error.js";
import { createDBPost } from "../../database/mysql/post/create.js";

export const createNewPost = async (req, res, next) => {
  console.log("Create New Post");
  const { language, type, title, short, tags } = req.body;
  const { topic, user, content } = res.locals;

  //Create New Post
  let coverPath;
  let tagsArray;
  let responsePost;
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

    responsePost = await createDBPost({
      author_id: user.id,
      topic_id: topic.id,
      type,
      cover: coverPath,
      content: postContent,
      tags: tagsArray,
    });
  } catch (err) {
    const error = new HttpError("Create New Post Failed!", 500);
    return next(error);
  }

  res.locals.response = {
    pid: responsePost?.id,
    message: `Create post successfully!`,
  };
  next();
};
