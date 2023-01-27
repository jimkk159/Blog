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
  const targetPost = blogs.filter((post) => post.id === "" + postId)[0];

  //User not find
  if (!targetPost) {
    const error = new HttpError("Post not exists", 422);
    return next(error);
  }

  res.json(targetPost);
};

export const getPosts = async (req, res, next) => {
  //For Debug
  count += 1;
  console.log("Get All Posts " + count);
  // await sleep(3000);
  const queryNumber = req.query.number >= 1 ? req.query.number : 1;
  const queryStartPage = req.query.start >= 0 ? req.query.start : 0;
  const queryResponse = blogs.slice(
    queryStartPage,
    queryStartPage + queryNumber
  );
  res.json(queryResponse);
};

export const getPostSearch = async (req, res, next) => {
  //For Debug
  console.log("Get Post Search");
  const searchTarget = req.query.search;
  const result = [];

  //Level 1 Search Author
  if (result.length < 150) {
    const searchAuthor = blogs.filter((x) => {
      return x.author.toLowerCase() === searchTarget.toLowerCase();
    });
    result.push(...searchAuthor);
  }

  //Level 2 Search topic
  if (result.length < 150) {
    const searchTopics = blogs.filter(
      (x) => x.topic.toLowerCase() === searchTarget.toLowerCase()
    );
    result.push(...searchTopics);
  }

  //Level 3 Search include title
  if (result.length < 150) {
    const searchTitles = blogs.filter((x) => {
      if (x.language?.title?.ch?.include(searchTarget)) return true;
      return x.language?.title?.en
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
    console.log(errors);
    return next(
      new HttpError("Invalid inputs, please check your input is correct", 422)
    );
  }

  //Find User
  const { uid, language, contentState } = req.body;

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
    author: findingUser.id,
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
    // console.log(newPost);
    blogs.push(newPost);
  } catch (err) {}

  res
    .status(200)
    .json({
      pid: newPost.id,
      message: `Create post successfully!`,
    });
};

export const deletePost = async (req, res, next) => {
  //For Debug
  console.log("Delete Post");
  // await sleep(3000);
  const deletePostId = req.params.pid;
  try {
    blogs = blogs.filter((blog) => {
      return blog.id !== +deletePostId;
    });
  } catch (err) {}

  res.status(200).json({ message: `Deleted post id:${req.params.pid}` });
};
