import { getDBUser, getDBUsersIn } from "../../database/mysql/user/read.js";
import {
  getDBFullPost,
  getDBLastestFullPosts,
} from "../../database/mysql/post/read.js";
import HttpError from "../../models/http-error.js";

export const getPost = async (req, res, next) => {
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
  res.locals.post = post;
  next();
};

export const getPosts = async (req, res, next) => {
  let targetPosts;
  try {
    const current = req.query.current >= 0 ? req.query.current : 0;
    const number = req.query.number >= 1 ? req.query.number : 1;
    targetPosts = await getDBLastestFullPosts({ current, number });
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      "Get Posts Error!, please try again later.",
      500
    );
    return next(error);
  }
  res.locals.posts = targetPosts;
  next();
};

export const getPostAuthor = async (req, res, next) => {
  const targetPost = res.locals.post;
  let author;
  try {
    author = await getDBUser(targetPost.author_id);
  } catch (err) {
    const error = new HttpError(
      "Finding author failed, please try again later.",
      500
    );
    return next(error);
  }

  //Author not find
  if (!author) {
    const error = new HttpError("Author not Find!", 404);
    return next(error);
  }
  res.locals.author = author;
  next();
};

export const getPostsAuthor = async (req, res, next) => {
  const targetPosts = res.locals.posts;

  //Not Any Posts
  if (targetPosts.length === 0) return next();

  let users = [];
  try {
    //Remove the duplication user
    const userSet = new Set(targetPosts.map((item) => item.author_id));
    //Remove the duplication user
    const targetUsers = [...userSet];
    users = await getDBUsersIn(targetUsers);
  } catch (err) {
    const error = new HttpError(
      "Finding authors failed, please try again later.",
      500
    );
    return next(error);
  }
  res.locals.authors = users;
  next();
};

// ToDo author
export const getPostSearch = async (req, res, next) => {
  //For Debug
  const searchTarget = req.query.search;
  const result = [];

  //Level 1 Search Author
  if (result.length < 150) {
    const searchAuthor = blogs.filter((item) => {
      return item.author.toLowerCase() === searchTarget.toLowerCase();
    });
    result.push(...searchAuthor);
  }

  //Level 2 Search topic
  if (result.length < 150) {
    const searchTopics = blogs.filter(
      (item) => item.topic.toLowerCase() === searchTarget.toLowerCase()
    );
    result.push(...searchTopics);
  }

  //Level 3 Search include title
  if (result.length < 150) {
    const searchTitles = blogs.filter((item) => {
      if (item.language?.title?.ch?.include(searchTarget)) return true;
      return item.language?.title?.en
        ?.toLowerCase()
        .include(searchTarget.toLowerCase());
    });
    result.push(...searchTitles);
  }

  console.log("search", searchTarget, result);
  res.json(result);
};
