import express from "express";

import {
  getPost,
  getPosts,
  getPostSearch,
  deletePost
} from "../controllers/posts-controller.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/search", getPostSearch);
router.get("/:pid", getPost);
router.delete("/:pid", deletePost);

export default router;
