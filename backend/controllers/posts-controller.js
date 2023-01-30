import { v4 as uuidv4 } from "uuid";
import normalize from "normalize-path";
import { validationResult } from "express-validator";

import { Dummy_blogs, Dummy_users, Dummy_search } from "./Dummy_data.js";
import HttpError from "../models/http-error.js";

let count = 0;
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const options = { year: "numeric", month: "short", day: "numeric" };

let blogs = Dummy_blogs;
export const getPost = async (req, res, next) => {
  const postId = req.params.pid;
  //For Debug
  count += 1;
  console.log("Get Post " + count);
  // await sleep(3000);

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

  let author;
  try {
    author = Dummy_users.filter((user) => user.id === targetPost.authorId)[0];
  } catch (err) {
    const error = new HttpError(
      "Finding author failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    ...targetPost,
    authorName: author.name,
    authorAvatar: author.avatar,
  });
};

export const getPosts = async (req, res, next) => {
  //For Debug
  count += 1;
  console.log("Get All Posts " + count);
  // await sleep(3000);
  let queryResponse;
  try {
    const queryNumber = req.query.number >= 1 ? req.query.number : 1;
    const queryStartPage = req.query.start >= 0 ? req.query.start : 0;
    queryResponse = blogs.slice(queryStartPage, queryStartPage + queryNumber);
  } catch (err) {
    const error = new HttpError(
      "Get Posts Error!, please try again later.",
      500
    );
    return next(error);
  }

  //Prepare the users need to query to database

  //Get the usersInfo
  try {
    //Remove the duplication user
    const userSet = new Set();
    queryResponse.map((item) => {
      userSet.add(item?.authorId);
    });

    //Remove the duplication user
    const userArray = [...userSet];
    const findingUsers = Dummy_users.filter((user) =>
      userArray.includes(user.id)
    );

    let userObj = {};
    for (let i = 0; i < findingUsers.length; i++) {
      const authorId = findingUsers[i].id;
      userObj[authorId] = findingUsers[i];
    }

    for (let i = 0; i < queryResponse.length; i++) {
      const targetAuthor = queryResponse[i].authorId;
      if (targetAuthor in userObj) {
        queryResponse[i] = {
          ...queryResponse[i],
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
  res.json(queryResponse);
};

//ToDo author
export const getPostSearch = async (req, res, next) => {
  //For Debug
  console.log("Get Post Search");
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

  //Validate the req
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs, please check your input is correct", 422)
    );
  }

  //Find User
  const { language, contentState } = req.body;
  const { userId: uid } = req.userData;

  let findingUser;
  try {
    findingUser = Dummy_users.filter((user) => user.id === uid)[0];
  } catch (err) {
    const error = new HttpError(
      "Finding user failed, please try again later.",
      500
    );
    return next(error);
  }

  //User not find
  if (!findingUser) {
    const error = new HttpError(
      "User not exists, singup an account first.",
      422
    );
    return next(error);
  }

  //Replace Images src
  let postContentState;
  try {
    const newContentState = JSON.parse(contentState);
    const newEntityMap = newContentState?.entityMap;

    // Unprocessable ContentState
    if (!newEntityMap) {
      return next(new HttpError("Create New Post Failed!", 422));
    }

    //Change Image
    req.files.map((file, index) => {
      newEntityMap[index].data.src = normalize(file.path);
    });
    postContentState = JSON.stringify(newContentState);

    // Unprocessable EditorState
    if (!postContentState) {
      return next(new HttpError("Create New Post Failed!", 422));
    }
  } catch (err) {
    const error = new HttpError("Create New Post Failed!", 500);
    return next(error);
  }

  //Create New Post
  const newPost = {
    id: uuidv4(),
    topic: null,
    type: null,
    date: new Date().toLocaleDateString("en-US", options),
    authorId: findingUser.id,
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: null,
    },
    language: { en: {}, ch: {} },
  };

  try {
    const postContent = {
      title: "",
      support: true,
      short: "bra bra bra",
      contentState: postContentState,
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

  //Validate the req
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs, please check your input is correct", 422)
    );
  }

  const postId = req.params.pid;
  const { language, contentState } = req.body;
  const { userId: uid } = req.userData;

  //Find Post
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

  //Check Post Owner
  if (targetPost.authorId !== uid) {
    const error = new HttpError("Permissions deny.", 403);
    return next(error);
  }

  //Find User
  let findingUser;
  try {
    findingUser = Dummy_users.filter((user) => user.id === uid)[0];
  } catch (err) {
    const error = new HttpError(
      "Finding user failed, please try again later.",
      500
    );
    return next(error);
  }

  //User not find
  if (!findingUser) {
    const error = new HttpError(
      "User not exists, singup an account first.",
      422
    );
    return next(error);
  }

  //Replace Images src
  let postContentState;
  try {
    const newContentState = JSON.parse(contentState);
    const newEntityMap = newContentState?.entityMap;

    // Unprocessable ContentState
    if (!newEntityMap) {
      return next(new HttpError("Edit Post Failed!", 422));
    }

    //Change Image
    req.files.map((file, index) => {
      newEntityMap[index].data.src = normalize(file.path);
    });
    postContentState = JSON.stringify(newContentState);

    // Unprocessable EditorState
    if (!postContentState) {
      return next(new HttpError("Edit Post Failed!", 422));
    }
  } catch (err) {
    const error = new HttpError("Edit Post Failed!", 500);
    return next(error);
  }

  //Edit Post
  try {
    const postContent = {
      title: "",
      support: true,
      short: "bra bra bra",
      contentState: postContentState,
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

export const deletePost = async (req, res, next) => {
  //For Debug
  console.log("Delete Post");
  // await sleep(3000);
  const postId = req.params.pid;
  const { userId: uid } = req.userData;

  //Find Post
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

  //Check Admin
  let isAdmin = false;
  if (Dummy_users.length > 0 && Dummy_users[0].id === uid) {
    isAdmin = true;
  }

  //Check Post Owner
  if (targetPost.authorId !== uid && !isAdmin) {
    const error = new HttpError("Permissions deny.", 403);
    return next(error);
  }

  //Delete Post
  try {
    blogs = blogs.filter((blog) => {
      return blog.id !== postId;
    });
  } catch (err) {
    const error = new HttpError(
      "Delete post failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: `Deleted post id:${req.params.pid}` });
};
