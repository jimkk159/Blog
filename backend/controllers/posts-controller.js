import { DUMMY_Structure, Dummy_blogs, Dummy_search } from "./Dummy_data.js";

export const getAllPosts = (req, res, next) => {
  res.json(Dummy_blogs);
};

export const getPostsStructure = (req, res, next) => {
  res.json(DUMMY_Structure);
};

export const getPostSearch = (req, res, next) => {
  res.json(Dummy_search);
};
