import express from "express";
import Post from "../module/post.js";
import { check } from "express-validator";
import commentsRouters from "../routes/comment-routes.js";
import * as factory from "../controllers/handle-factory.js";
import * as postController from "../controllers/post-controller.js";
import * as authController from "../controllers/auth-controller.js";
import * as shareController from "../controllers/share-controller.js";
import * as commentController from "../controllers/comment-controller.js";

const router = express.Router();

router.use("/:postId/comments", commentController.setPostId, commentsRouters);

router.get("/", postController.getAll);
router.get("/home", postController.getHome);
router.get("/views", postController.getView);
router.get("/thumbs", postController.getThumb);
router.get("/comments", postController.getComment);
router.get("/search", postController.search, postController.getAll);

router.get(
  "/me",
  authController.authUserByToken,
  postController.getMe,
  postController.search,
  postController.getAllWithoutCache
);

router.get("/:id", postController.getOne);
router.patch("/:id/thumb", postController.updateThumb);

router.use(authController.authUserByToken);

router.post(
  "/",
  [
    check("CategoryId").not().isEmpty(),
    check("title").not().isEmpty(),
    check("content").not().isEmpty(),
  ],
  shareController.validation,
  postController.createOne
);

router
  .route("/:id")
  .patch(postController.checkPermission, postController.updateOne)
  .delete(postController.checkPermission, factory.deleteOne(Post));

router.patch("/:id/category/:CategoryId", postController.updateCategory);

export default router;
