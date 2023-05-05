import express from "express";
import User from "../module/user.js";
import { check } from "express-validator";
import fileUploadToServer from "../utils/file-upload.js";
import * as factory from "../controllers/handle-factory.js";
import * as authController from "../controllers/auth-controller.js";
import * as userController from "../controllers/user-controller.js";
import * as shareController from "../controllers/share-controller.js";

const router = express.Router();

// check token middleware
router.use(authController.authUserByToken);

// TODO 沒測到 fileUploadToServer
router
  .route("/me")
  .get(userController.getMe, factory.getOne(User))
  .patch(
    fileUploadToServer.single("avatar"),
    userController.updateMe,
    factory.updateOne(User)
  )
  .delete(userController.getMe, factory.deleteOne(User));

router.use(authController.restrictTo("root"));

router
  .route("/:id")
  .get(factory.getOne(User))
  .patch(factory.updateOne(User))
  .delete(factory.deleteOne(User));

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

export default router;
