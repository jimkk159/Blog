import express from "express";
import { check } from "express-validator";

import fileUploadToServer from "../utils/file-upload.js";
import factory from "../controllers/handle-factory.js";
import topicController from "../controllers/topic-controller.js";
import userController from "../controllers/auth-controller.js";
import postController from "../controllers/post-controller.js";
import shareController from "../controllers/share-controller.js";
import authController from "../controllers/auth-controller.js";

const table = `post`;
const router = express.Router();

router.get(
  "/search",
  [check("search").not().isEmpty()],
  shareController.validation,
  postController.getPostSearch,
  shareController.responseHttp
);
router.get("/", postController.getAllPost, shareController.responseHttp);
router
  .route("/many")
  .get(postController.getPostByIds, shareController.responseHttp);
router
  .route("/:id")
  .get(
    postController.getOnePost,
    postController.getTopicRelatedPost,
    postController.getTagRelatedPost,
    postController.getAuthorRelatedPost,
    shareController.responseHttp
  );

// check token middleware
router.use(authController.authToken);

router.post(
  "/",
  fileUploadToServer.fields([
    { name: "cover", maxCount: 1 },
    { name: "images" },
  ]),
  [check("detail").not().isEmpty()],
  shareController.validation,
  userController.identifyUser,
  topicController.identifyTopic,
  topicController.validationTopic,
  shareController.replaceImageSrc,
  topicController.createOneTopic,
  postController.createOnePost,
  postController.getOnePost,
  postController.getTopicRelatedPost,
  postController.getTagRelatedPost,
  postController.getAuthorRelatedPost,
  shareController.responseHttp
);

router.patch(
  "/pin/:id",
  [check("pin").not().isEmpty()],
  shareController.validation,
  postController.identifyPost,
  shareController.restrictTo("root", "leader", "manager"),
  postController.pinPost
);

router
  .route("/:id")
  .put(
    fileUploadToServer.fields([
      { name: "cover", maxCount: 1 },
      { name: "images" },
    ]),
    shareController.validation,
    userController.identifyUser,
    postController.identifyPost,
    topicController.parseTopic,
    postController.identifyAuthor,
    shareController.replaceImageSrc,
    postController.updateOnePost,
    postController.getOnePost,
    postController.getTopicRelatedPost,
    postController.getTagRelatedPost,
    postController.getAuthorRelatedPost,
    shareController.responseHttp
  )
  .delete(
    postController.identifyPost,
    postController.judeDeletePostPermission("root", "leader"),
    factory.deleteOne(table)
  );

export default router;
