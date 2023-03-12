import express from "express";
import { check } from "express-validator";
import factory from "../controllers/handle-factory.js";
import authController from "../controllers/auth-controller.js";
import shareController from "../controllers/share-controller.js";
import { user_ } from "../utils/table.js";

const router = express.Router();

// check token middleware
router.use(authController.authToken);

// router.use(shareController.restrictTo(("root", "leader", "manager")));

router.route("/").get(factory.getAll(user_), shareController.responseUserHttp);
router
  .route("/:id")
  .get(factory.getOne(user_), shareController.responseUserHttp);

// router.use(shareController.restrictTo(("root", "leader")));

router
  .route("/")
  .post(
    [
      check("name").not().isEmpty(),
      check("email").normalizeEmail().isEmail(),
      check("password").isLength({ min: 6 }),
      check("confirmPassword").isLength({ min: 6 }),
    ],
    shareController.validation,
    authController.signup("leader", "manager", "user")
  );

router
  .route("/team")
  .post(
    [
      check("users.*.name").not().isEmpty(),
      check("users.*.email").normalizeEmail().isEmail(),
      check("users.*.password").isLength({ min: 6 }),
      check("users.*.confirmPassword").isLength({ min: 6 }),
    ],
    shareController.validation,
    authController.singupTeam("leader", "manager", "user")
  );

router.use(shareController.restrictTo("root"));

router
  .route("/:id")
  .patch(factory.updateOne(user_), shareController.responseHttp)
  .delete(factory.deleteOne(user_));

export default router;
