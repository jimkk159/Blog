import express from "express";
import { check } from "express-validator";

import checkAuth from "../middleware/check-auth.js";
import fileUploadToServer from "../middleware/file-upload.js";

import {
  getPost,
  getPosts,
  getPostSearch,
  createNewPost,
  editPost,
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
  [check("contentState").not().isEmpty(), check("uid").not().isEmpty()],
  createNewPost
);
router.put(
  "/:pid",
  fileUploadToServer.array("images"),
  [check("contentState").not().isEmpty(), check("uid").not().isEmpty()],
  editPost
);
router.delete("/:pid", deletePost);

export default router;
