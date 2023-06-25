import express from "express";
import { check } from "express-validator";
import Category from "../module/category.js";
import * as factory from "../controllers/handle-factory.js";
import * as shareController from "../controllers/share-controller.js";
import * as authController from "../controllers/auth-controller.js";
import * as categoryController from "../controllers/category-controller.js";

const router = express.Router();

router.get("/", factory.getAll(Category));
router.get("/:id", factory.getOne(Category));

router.use(authController.authUserByToken);

router.post(
  "/",
  [check("name").not().isEmpty(), check("ParentId").not().isEmpty()],
  shareController.validation,
  categoryController.createOne
);

router.use(authController.restrictTo("root"));

router
  .route("/:id")
  .patch(categoryController.updateOne)
  .delete(categoryController.deleteOne);

export default router;
