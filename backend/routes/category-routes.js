import express from "express";
import { check } from "express-validator";
import Category from "../module/category.js";
import * as factory from "../controllers/handle-factory.js";
import * as shareController from "../controllers/share-controller.js";
import * as authController from "../controllers/auth-controller.js";
import * as categoryController from "../controllers/category-controller.js";

const router = express.Router();

router
  .route("/")
  .get(factory.getAll(Category))
  .post(
    authController.authUserByToken,
    [check("name").not().isEmpty(), check("ParentId").not().isEmpty()],
    shareController.validation,
    categoryController.createOne
  );

router
  .route("/:id")
  .get(factory.getOne(Category))
  .patch(authController.authUserByToken, categoryController.updateOne)
  .delete(authController.authUserByToken, categoryController.deleteOne);

export default router;
