import express from "express";

import {
  getAllPosts,
  getPostsStructure,
  getPostSearch,
} from "../controllers/posts-controller.js";

const router = express.Router();

router.get("/", getAllPosts);
router.get("/structure", getPostsStructure);
router.get("/search", getPostSearch);

export default router;
