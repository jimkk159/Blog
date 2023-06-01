import express from "express";
import User from "../module/user.js";
import { check } from "express-validator";
import * as upload from "../utils/file-upload.js";
import * as factory from "../controllers/handle-factory.js";
import * as authController from "../controllers/auth-controller.js";
import * as userController from "../controllers/user-controller.js";
import * as shareController from "../controllers/share-controller.js";

const router = express.Router();

router.use(authController.authUserByToken);

router
  .route("/me")
  .get(
    userController.getMe,
    factory.getOne(User)
  )
  .patch(
    userController.updateMe,
    factory.updateOne(User)
  )
  .delete(
    userController.getMe,
    factory.deleteOne(User)
  );

router.patch(
  "/avatar",
  upload.uploadToMemory.single("avatar"),
  userController.updateAvatar,
  factory.updateOne(User)
);

router.use(authController.restrictTo("root"));

router
  .route("/")
  .get(factory.getAll(User))
  .post(
    [
      check("name").not().isEmpty(),
      check("email").normalizeEmail().isEmail(),
      check("password").isLength({ min: 6 }),
      check("confirmPassword").isLength({ min: 6 }),
    ],
    shareController.validation,
    userController.setHasValidate,
    factory.createOne(User)
  );

router
  .route("/:id")
  .get(factory.getOne(User))
  .patch(factory.updateOne(User))
  .delete(factory.deleteOne(User));

export default router;
