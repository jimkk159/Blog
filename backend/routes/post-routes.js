import express from "express";
import Post from "../module/post.js";
import { check } from "express-validator";
import * as factory from "../controllers/handle-factory.js";
import * as postController from "../controllers/post-controller.js";
import * as authController from "../controllers/auth-controller.js";
import * as shareController from "../controllers/share-controller.js";

const router = express.Router();

router
  .route("/")
  .get(postController.getAll)
  .post(
    authController.authUserByToken,
    [
      check("categoryId").not().isEmpty(),
      check("title").not().isEmpty(),
      check("content").not().isEmpty(),
    ],
    shareController.validation,
    postController.createOne
  );

router
  .route("/:id")
  .get(postController.getOne)
  .patch(authController.authUserByToken, postController.updateOne)
  .delete(authController.authUserByToken, postController.deleteOne);

router
  .route("/:id/category/:categoryId")
  .patch(authController.authUserByToken, postController.updateCategory);

export default router;
