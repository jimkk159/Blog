import express from "express";
import { check } from "express-validator";
import factory from "../controllers/handle-factory.js";
import fileUploadToServer from "../utils/file-upload.js";
import authController from "../controllers/auth-controller.js";
import userController from "../controllers/user-controller.js";
import shareController from "../controllers/share-controller.js";
import { user_ } from "../utils/table.js";

const router = express.Router();

// check token middleware
router.use(authController.authToken);

router
  .route("/me")
  .get(userController.getMe, factory.getOne(user_))
  .patch(
    fileUploadToServer.single("avatar"),
    userController.updateMe,
    factory.updateOne(user_)
  )
  .delete(userController.getMe, factory.deleteOne(user_));

router.use(shareController.restrictTo(("root", "manager")));

router.get("/:id", factory.getOne(user_));
router
  .route("/")
  .get(factory.getAll(user_))
  .post(
    [
      check("name").not().isEmpty(),
      check("email").normalizeEmail().isEmail(),
      check("password").isLength({ min: 6 }),
      check("confirmPassword").isLength({ min: 6 }),
    ],
    shareController.validation,
    authController.signup("manager", "user")
  );

router.use(shareController.restrictTo("root"));

router
  .route("/:id")
  .patch(factory.updateOne(user_))
  .delete(factory.deleteOne(user_));
  
router.post(
  "/team",
  [
    check("users.*.name").not().isEmpty(),
    check("users.*.email").normalizeEmail().isEmail(),
    check("users.*.password").isLength({ min: 6 }),
    check("users.*.confirmPassword").isLength({ min: 6 }),
  ],
  shareController.validation,
  authController.singupTeam("manager", "user")
);

export default router;
