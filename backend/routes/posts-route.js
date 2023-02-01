import express from "express";
import { check } from "express-validator";

import checkAuth from "../middleware/check-auth.js";
import fileUploadToServer from "../middleware/file-upload.js";

import {
  getUser,
} from "../controllers/users-controller.js";
import {
  getPost,
  getPosts,
  getPostAuthor,
  getPostsAuthor,
  addPostAuthor,
  addPostsAuthor,
  checkPostAuthor,
  getPostSearch,
  createNewPost,
  editPost,
  pinPost,
  deletePost,
} from "../controllers/posts-controller.js";
import {
  validation,
  replaceImageSrc,
  checkAdmin,
} from "../controllers/share-controller.js";

const router = express.Router();

router.get("/", getPosts, getPostsAuthor, addPostsAuthor);
router.get("/search", getPostSearch);
router.get("/:pid", getPost, getPostAuthor, addPostAuthor);

// check token middleware
router.use(checkAuth);

router.post(
  "/new",
  fileUploadToServer.fields([
    { name: "cover", maxCount: 1 },
    { name: "images" },
  ]),
  [check("contentState").not().isEmpty()],
  validation,
  getUser,
  replaceImageSrc,
  createNewPost
);

router.put(
  "/:pid",
  fileUploadToServer.array("images"),
  [check("contentState").not().isEmpty()],
  validation,
  addPostAuthor,
  getUser,
  checkPostAuthor,
  replaceImageSrc,
  editPost
);

router.patch(
  "/:pid/pin",
  [check("pin").not().isEmpty()],
  validation,
  addPostAuthor,
  checkAdmin,
  pinPost
);

router.delete("/:pid", addPostAuthor, checkAdmin, deletePost);

export default router;
