import express from "express";
import { check } from "express-validator";
import * as postController from "../controllers/post-controller.js";
import * as authController from "../controllers/auth-controller.js";
import * as shareController from "../controllers/share-controller.js";

const router = express.Router();

router.get("/", postController.getAll);

router.get("/search", postController.search, postController.getAll);

router.get(
  "/me",
  authController.authUserByToken,
  postController.getMe,
  postController.search,
  postController.getAll
);

router.get("/:id", postController.getOne);

router.use(authController.authUserByToken);

router.post(
  "/",
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
  .patch(postController.updateOne)
  .delete(postController.deleteOne);
router.route("/:id/category/:categoryId").patch(postController.updateCategory);

export default router;
