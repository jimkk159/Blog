import express from "express";
import { check, oneOf } from "express-validator";

import fileUploadToServer from "../middleware/file-upload.js";

import {
  getPost,
  getPosts,
  getPostSearch,
  createNewPost,
  deletePost,
} from "../controllers/posts-controller.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/search", getPostSearch);
router.post(
  "/new",
  check("editorState").isEmpty(),
  fileUploadToServer.array("images"),
  createNewPost
);
router.get("/:pid", getPost);
router.delete("/:pid", deletePost);

export default router;
