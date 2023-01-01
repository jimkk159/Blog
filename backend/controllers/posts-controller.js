import { DUMMY_Structure, Dummy_blogs, Dummy_search } from "./Dummy_data.js";
let count = 0;
const sleep = ms => new Promise(res => setTimeout(res, ms));
export const getAllPosts = async (req, res, next) => {

  //For Debug
  count += 1;
  console.log("Get All Posts " + count);
  await sleep(3000);
  res.json(Dummy_blogs);
};

export const getPostsStructure = async (req, res, next) => {
  //For Debug
  console.log("Get Posts Structure");
  res.json(DUMMY_Structure);
};

export const getPostSearch = async (req, res, next) => {
  //For Debug
  console.log("Get Post Search");
  res.json(Dummy_search);
};
