import express from "express";
import { check } from "express-validator";
import Comment from "../module/comment.js";
import * as factory from "../controllers/handle-factory.js";
import * as authController from "../controllers/auth-controller.js";
import * as shareController from "../controllers/share-controller.js";
import * as commentController from "../controllers/comment-controller.js";

const router = express.Router();

router.get("/", commentController.getAll);
router.get("/:id", factory.getOne(Comment));

router.use(authController.authUserByToken);

router.post(
  "/",
  [check("PostId").not().isEmpty(), check("content").not().isEmpty()],
  shareController.validation,
  commentController.createOne
);

router
  .route("/:id")
  .patch(commentController.checkPermission, commentController.updateOne)
  .delete(commentController.checkPermission, factory.deleteOne(Comment));

export default router;
