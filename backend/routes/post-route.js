import express from "express";

import {
  getAllPosts,
  getPostsStructure,
  getPostSearch,
} from "../controllers/posts-controller.js";

const router = express.Router();

router.get("/", getAllPosts);
router.get("/search", getPostSearch);
router.get("/structure", getPostsStructure);

export default router;
