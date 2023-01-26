import express from "express";
import { check } from "express-validator";

import checkAuth from "../middleware/check-auth.js";
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
router.get("/:pid", getPost);

// check token middleware
router.use(checkAuth);

router.post(
  "/new",
  fileUploadToServer.array("images"),
  [check("editorState").not().isEmpty(), check("uid").not().isEmpty()],
  createNewPost
);
router.delete("/:pid", deletePost);

export default router;
