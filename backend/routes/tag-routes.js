import express from "express";
import Tag from "../module/tag.js";
import * as factory from "../controllers/handle-factory.js";
import * as authController from "../controllers/auth-controller.js";

const router = express.Router();

router
  .route("/")
  .get(factory.getAll(Tag))
  .post(authController.authUserByToken, factory.createOne(Tag));

router.get("/:id", factory.getOne(Tag));

router.use(authController.authUserByToken, authController.restrictTo("root"));

router
  .route("/:id")
  .patch(factory.updateOne(Tag))
  .delete(factory.deleteOne(Tag));

export default router;
