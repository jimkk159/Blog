import express from "express";
import { check } from "express-validator";

import checkAuth from "../middleware/check-auth.js";
import fileUploadToServer from "../middleware/file-upload.js";

import { getUser, checkAdmin } from "../controllers/user-controller/index.js";
import {
  checkTopic,
  createNewTopic,
} from "../controllers/topic-controller/index.js";
import {
  getPost,
  getFullPost,
  getFullPosts,
  checkPostAuthor,
  getPostSearch,
  getRelatedPost,
  createNewPost,
  editPost,
  pinPost,
  deletePost,
} from "../controllers/post-controller/index.js";
import {
  validation,
  replaceImageSrc,
  responseHttp,
} from "../controllers/share-controller/index.js";

const router = express.Router();

router.get("/", getFullPosts, responseHttp);
router.get("/search", getPostSearch, responseHttp);
router.get("/:pid", getFullPost, responseHttp);
router.get("/test/:pid", getRelatedPost, responseHttp);

// check token middleware
router.use(checkAuth);

router.post(
  "/new",
  fileUploadToServer.fields([
    { name: "cover", maxCount: 1 },
    { name: "images" },
  ]),
  [check("content").not().isEmpty()],
  validation,
  getUser,
  replaceImageSrc,
  checkTopic,
  createNewTopic,
  createNewPost,
  responseHttp
);

router.put(
  "/:pid",
  fileUploadToServer.fields([
    { name: "cover", maxCount: 1 },
    { name: "images" },
  ]),
  [check("content").not().isEmpty()],
  validation,
  getPost,
  getUser,
  checkPostAuthor,
  replaceImageSrc,
  checkTopic,
  createNewTopic,
  editPost,
  responseHttp
);

router.patch(
  "/pin/:pid",
  [check("pin").not().isEmpty()],
  validation,
  getPost,
  checkAdmin,
  pinPost,
  responseHttp
);

router.delete("/:pid", getPost, checkAdmin, deletePost, responseHttp);

export default router;
