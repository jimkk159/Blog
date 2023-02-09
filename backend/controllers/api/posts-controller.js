import { v4 as uuidv4 } from "uuid";
import normalize from "normalize-path";

import {
  getDBUser,
  getDBPost,
  getDBUsersIn,
  getDBLastestFullPosts,
  createDBPost,
  deleteDBPost,
  updateDBPostPin,
} from "../database/mysql.js";
import { blogs } from "../blogs.js";
import HttpError from "../../models/http-error.js";

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const options = { year: "numeric", month: "short", day: "numeric" };

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

export const addPostAuthor = async (req, res, next) => {
  const author = res.locals.author;
  const targetPost = res.locals.post;

  res.json({
    ...targetPost,
    authorName: author.name,
    authorAvatar: author.avatar,
  });
};

export const addPostsAuthor = async (req, res, next) => {
  const targetPosts = res.locals.posts;
  const authors = res.locals.authors;
  let result = targetPosts;

  //Not Any Posts
  if (targetPosts.length === 0) return res.json(result);

  try {
    //Create the Obj with userid as key
    let userObj = {};
    authors.forEach((author) => {
      const uid = author.id;
      userObj[uid] = author;
    });

    //loop through the post and add the author information
    result = targetPosts.map((targetPost) => {
      const authorId = targetPost.author_id;
      if (authorId in userObj) {
        targetPost = {
          ...targetPost,
          authorName: userObj[authorId].name,
          authorAvatar: userObj[authorId].avatar,
        };
      }
      return targetPost;
    });
  } catch (err) {
    const error = new HttpError(
      "Get Posts Error!, please try again later.",
      500
    );
    return next(error);
  }
  res.json(result);
};

export const checkPostAuthor = (req, res, next) => {
  //Find User
  const { uid } = req.userData;
  const targetPost = res.locals.post;

  //Check Post Owner
  if (targetPost.uid !== uid) {
    const error = new HttpError("Permissions deny.", 403);
    return next(error);
  }
  next();
};

//ToDo author
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

  res.status(200).json({
    pid: newPost.id,
    message: `Create post successfully!`,
  });
};

export const editPost = async (req, res, next) => {
  console.log("Edit Post");
  const { language } = req.body;
  const targetPost = res.locals.post;
  const contentState = res.locals.contentState;

  //Edit Post
  try {
    const postContent = {
      title: "",
      support: true,
      short: "bra bra bra",
      contentState,
    };
    switch (language) {
      case "en":
        targetPost.date = new Date().toLocaleDateString("en-US", options);
        targetPost.language.en = postContent;
        break;
      case "ch":
        targetPost.date = new Date().toLocaleDateString("en-US", options);
        targetPost.language.ch = postContent;
        break;
      default:
        const error = new HttpError("Unsupport language", 501);
        return next(error);
    }
  } catch (err) {
    const error = new HttpError("Edit Post Failed!", 500);
    return next(error);
  }

  res.status(200).json({
    pid: targetPost.id,
    message: `Create post successfully!`,
  });
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
    await updateDBPostPin(pid, +queryPin);
  } catch (err) {
    const error = new HttpError(
      "Pin post failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: `Pin post successfully!` });
};

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
    deleteDBPost(pid);
  } catch (err) {
    const error = new HttpError(
      "Delete post failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: `Deleted post id:${req.params.pid}` });
};
