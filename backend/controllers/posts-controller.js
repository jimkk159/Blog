import { v4 as uuidv4 } from "uuid";
import normalize from "normalize-path";

import { users, blogs } from "./blogs.js";
import HttpError from "../models/http-error.js";

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const options = { year: "numeric", month: "short", day: "numeric" };

export const getPost = async (req, res, next) => {
  const postId = req.params.pid;
  let targetPost;
  try {
    targetPost = blogs.filter((blog) => blog.id === postId)[0];
  } catch (err) {
    const error = new HttpError(
      "Finding post failed, please try again later.",
      500
    );
    return next(error);
  }

  //Post not find
  if (!targetPost) {
    const error = new HttpError("Post not exists!", 422);
    return next(error);
  }
  res.locals.post = targetPost;
  next();
};

export const getPosts = async (req, res, next) => {
  let targetPosts;
  try {
    const queryNumber = req.query.number >= 1 ? req.query.number : 1;
    const queryStartPage = req.query.start >= 0 ? req.query.start : 0;
    targetPosts = blogs.slice(queryStartPage, queryStartPage + queryNumber);
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
    author = users.filter((user) => user.id === targetPost.authorId)[0];
  } catch (err) {
    const error = new HttpError(
      "Finding author failed, please try again later.",
      500
    );
    return next(error);
  }
  res.locals.author = author;
  next();
};

export const getPostsAuthor = async (req, res, next) => {
  const targetPosts = res.locals.posts;

  let findingAhthors = [];
  try {
    //Remove the duplication user
    const userSet = new Set();
    targetPosts.map((item) => {
      userSet.add(item?.authorId);
    });

    //Remove the duplication user
    const usersArray = [...userSet];
    findingAhthors = users.filter((user) => usersArray.includes(user.id));
  } catch (err) {
    const error = new HttpError(
      "Finding authors failed, please try again later.",
      500
    );
    return next(error);
  }
  res.locals.authors = findingAhthors;
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
  const findingAhthors = res.locals.authors;
  try {
    //Create the Obj with userid as key
    let userObj = {};
    for (let i = 0; i < findingAhthors.length; i++) {
      const authorId = findingAhthors[i].id;
      userObj[authorId] = findingAhthors[i];
    }

    //loop through the post and add the author information
    for (let i = 0; i < targetPosts.length; i++) {
      const targetAuthor = targetPosts[i].authorId;
      if (targetAuthor in userObj) {
        targetPosts[i] = {
          ...targetPosts[i],
          authorName: userObj[targetAuthor].name,
          authorAvatar: userObj[targetAuthor].avatar,
        };
      }
    }
  } catch (err) {
    const error = new HttpError(
      "Get Posts Error!, please try again later.",
      500
    );
    return next(error);
  }
  res.json(targetPosts);
};

export const checkPostAuthor = (req, res, next) => {
  //Find User
  const { userId } = req.userData;
  const targetPost = res.locals.post;

  //Check Post Owner
  if (targetPost.authorId !== userId) {
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
  const findingUser = res.locals.user;
  const contentState = res.locals.contentState;

  //Create New Post
  let coverPath;
  if (
    req?.files?.cover &&
    req?.files?.cover.length > 0 &&
    req?.files?.cover[0]?.path
  ) {
    coverPath = normalize(req.files?.cover[0]?.path);
  }

  const newPost = {
    id: uuidv4(),
    topic: null,
    type: null,
    date: new Date().toLocaleDateString("en-US", options),
    authorId: findingUser.id,
    isPined: false,
    cover: {
      img: coverPath,
      description: null,
    },
    language: { en: {}, ch: {} },
    comments: [],
    tags: tags ? (Array.isArray(tags) ? [...tags] : [tags]) : [],
  };

  try {
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
    blogs.push(newPost);
  } catch (err) {}

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
  const queryPin = req.query.pin;
  const targetPost = res.locals.post;
  const admin = res.locals.admin;

  if (!admin) {
    const error = new HttpError("Permissions deny.", 422);
    return next(error);
  }

  //Pin Post
  try {
    targetPost.isPined = !!+queryPin;
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
  const postId = req.params.pid;
  const { userId } = req.userData;
  const targetPost = res.locals.post;
  const admin = res.locals.admin;

  //Check Post Owner
  if (targetPost.authorId !== userId && !admin) {
    const error = new HttpError("Permissions deny.", 403);
    return next(error);
  }

  //Delete Post
  try {
    let target;
    blogs.map((blog, index) => {
      if (blog.id === postId) target = index;
    });
    if (target > -1) {
      blogs.splice(target, 1);
    }
  } catch (err) {
    const error = new HttpError(
      "Delete post failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: `Deleted post id:${req.params.pid}` });
};
