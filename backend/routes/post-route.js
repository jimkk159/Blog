import express from "express";

import {
  getPost,
  getPosts,
  getPostSearch,
} from "../controllers/posts-controller.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/search", getPostSearch);
router.get("/:postId", getPost);

export default router;
