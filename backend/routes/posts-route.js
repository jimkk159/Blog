import express from "express";
import { check } from "express-validator";

import checkAuth from "../middleware/check-auth.js";
import fileUploadToServer from "../middleware/file-upload.js";

import userController from "../controllers/user-controller/index.js";
import topicController from "../controllers/topic-controller/index.js";
import postController from "../controllers/post-controller/index.js";
import shareController from "../controllers/share-controller/index.js";

const router = express.Router();

router.get(
  "/search",
  [check("query").not().isEmpty()],
  shareController.validation,
  postController.getPostSearch,
  shareController.responseHttp
);
router.get("/", postController.getFullPosts, shareController.responseHttp);
router.get("/:pid", postController.getFullPost, shareController.responseHttp);

// check token middleware
router.use(checkAuth);

router.post(
  "/new",
  fileUploadToServer.fields([
    { name: "cover", maxCount: 1 },
    { name: "images" },
  ]),
  [check("content").not().isEmpty()],
  shareController.validation,
  userController.identifyUser,
  shareController.replaceImageSrc,
  topicController.checkTopic,
  topicController.createNewTopic,
  postController.createNewPost,
  shareController.responseHttp
);

router.put(
  "/:pid",
  fileUploadToServer.fields([
    { name: "cover", maxCount: 1 },
    { name: "images" },
  ]),
  [check("content").not().isEmpty()],
  shareController.validation,
  postController.getPost,
  userController.identifyUser,
  postController.checkPostAuthor,
  shareController.replaceImageSrc,
  topicController.checkTopic,
  topicController.createNewTopic,
  postController.editPost,
  shareController.responseHttp
);

router.patch(
  "/pin/:pid",
  [check("pin").not().isEmpty()],
  shareController.validation,
  postController.getPost,
  userController.checkAdmin,
  postController.pinPost,
  shareController.responseHttp
);

router.delete(
  "/:pid",
  postController.getPost,
  userController.checkAdmin,
  postController.deletePost,
  shareController.responseHttp
);

export default router;
