import {
  getDBPost,
  getDBFullPost,
  getDBRelatedPost,
  getDBLastestFullPosts,
} from "../../database/mysql/post/read.js";
import HttpError from "../../models/http-error.js";

export const getPost = async (req, res, next) => {
  const pid = req.params.pid;

  let post;
  try {
    post = await getDBPost(pid);
  } catch (err) {
    const error = new HttpError(
      "Finding post failed, please try again later.",
      500
    );
    return next(error);
  }

  //Post not find
  if (!post) {
    const error = new HttpError("Post not Find!", 404);
    return next(error);
  }
  res.locals.response = post;
  res.locals.post = post;
  next();
};

export const getFullPost = async (req, res, next) => {
  const pid = req.params.pid;

  let post;
  try {
    post = await getDBFullPost(pid);
  } catch (err) {
    const error = new HttpError(
      "Finding post failed, please try again later.",
      500
    );
    return next(error);
  }

  //Post not find
  if (!post) {
    const error = new HttpError("Post not Find!", 404);
    return next(error);
  }

  let related = [];
  try {
    related = await getDBRelatedPost(pid, 5);
    if (!related) related = [];
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Finding post failed, please try again later.",
      500
    );
    return next(error);
  }

  const postInfo = {
    id: post.id,
    date: post.update,
    topic_id: post.topic_id,
    topic: post.topic,
    type: post.type,
    pin: post.pin,
    cover: post.cover,
    author_id: post.author_id,
    author: post.author,
    avatar: post.avatar,
    tags: post["GROUP_CONCAT(`tag`.`tag`)"]
      ? post["GROUP_CONCAT(`tag`.`tag`)"].split(",")
      : [],
    related,
    content: {
      en: {
        title: post.en_title,
        short: post.en_short,
        content: post.en_content,
      },
      ch: {
        title: post.ch_title,
        short: post.ch_short,
        content: post.ch_content,
      },
    },
  };
  res.locals.response = postInfo;
  res.locals.post = post;
  next();
};

export const getFullPosts = async (req, res, next) => {
  let posts = [];
  try {
    const current = req.query.current >= 0 ? req.query.current : 0;
    const number = req.query.number >= 1 ? req.query.number : 1;
    posts = await getDBLastestFullPosts({ current, number });
  } catch (err) {
    const error = new HttpError(
      "Get Posts Error!, please try again later.",
      500
    );
    return next(error);
  }

  const postInfos = posts.map((post) => ({
    id: post.id,
    date: post.update,
    topic_id: post.topic_id,
    topic: post.topic,
    type: post.type,
    pin: post.pin,
    cover: post.cover,
    author_id: post.author_id,
    author: post.author,
    avatar: post.avatar,
    tags: post["GROUP_CONCAT(`tag`.`tag`)"]
      ? post["GROUP_CONCAT(`tag`.`tag`)"].split(",")
      : [],
    content: {
      en: {
        title: post.en_title,
        short: post.en_short,
        content: post.en_content,
      },
      ch: {
        title: post.ch_title,
        short: post.ch_short,
        content: post.ch_content,
      },
    },
  }));

  res.locals.response = postInfos;
  res.locals.posts = posts;
  next();
};
