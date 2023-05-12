import express from "express";
import { check } from "express-validator";
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

router.get("/search", postController.search, postController.getAll);

router
  .route("/:id")
  .get(postController.getOne)
  .patch(authController.authUserByToken, postController.updateOne)
  .delete(authController.authUserByToken, postController.deleteOne);

router
  .route("/:id/category/:categoryId")
  .patch(authController.authUserByToken, postController.updateCategory);

export default router;
