import express from "express";
import Tag from "../module/tag.js";
import * as factory from "../controllers/handle-factory.js";
import * as authController from "../controllers/auth-controller.js";

const router = express.Router();

router
  .route("/")
  .get(factory.getAll(Tag))
  .post(authController.authUserByToken, factory.createOne(Tag));

router
  .route("/:id")
  .get(factory.getOne(Tag))
  .patch(
    authController.authUserByToken,
    authController.restrictTo("root"),
    factory.updateOne(Tag)
  )
  .delete(
    authController.authUserByToken,
    authController.restrictTo("root"),
    factory.deleteOne(Tag)
  );

export default router;
