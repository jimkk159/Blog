import normalize from "normalize-path";
import HttpError from "../../models/http-error.js";
import { createDBPost } from "../../database/mysql/post/create.js";

export const createNewPost = async (req, res, next) => {
  console.log("Create New Post");
  const { title, language, tags } = req.body;
  const { topic, user, contentState } = res.locals;

  //Create New Post
  let coverPath;
  if (
    req?.files?.cover &&
    req?.files?.cover.length > 0 &&
    req?.files?.cover[0]?.path
  ) {
    coverPath = normalize(req.files?.cover[0]?.path);
  }

  let newPost;
  try {
    newPost = {
      author_id: user.id,
      topic_id: topic.id,
      type: "Post",
      cover: coverPath ? coverPath : null,
      language: { en: {}, ch: {} },
      // comments: [],
      tags: tags
        ? Array.isArray(tags)
          ? JSON.stringify([...tags])
          : JSON.stringify([tags])
        : JSON.stringify([]),
    };
    const postContent = {
      title,
      support: true,
      short: "bra bra bra",
      contentState,
    };
    switch (language) {
      case "en":
        newPost.language.en = postContent;
        break;
      case "ch":
        newPost.language.ch = postContent;
        break;
      default:
        const error = new HttpError("Unsupport language", 501);
        return next(error);
    }
  } catch (err) {
    const error = new HttpError("Create New Post Failed!", 500);
    return next(error);
  }

  //Save Post to Database
  try {
    newPost = await createDBPost({
      author_id: newPost.author_id,
      topic_id: newPost.topic_id,
      type: "Post",
      cover: newPost.cover,
      language: JSON.stringify(newPost.language),
      tags: newPost.tags,
    });
  } catch (err) {
    const error = new HttpError("Create New Post Failed!", 500);
    return next(error);
  }

  res.locals.response = {
    pid: newPost?.id,
    message: `Create post successfully!`,
  };
  next();
};
