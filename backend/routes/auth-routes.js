import express from "express";
import passport from "passport";
import { check } from "express-validator";

import * as authController from "../controllers/auth-controller.js";
// import oauthController from "../controllers/oauth-controller.js";
import * as shareController from "../controllers/share-controller.js";

const router = express.Router();

//---------------Local--------------------
router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
    check("confirmPassword").isLength({ min: 6 }),
  ],
  shareController.validation,
  authController.signup
);

router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").not().isEmpty(),
  ],
  shareController.validation,
  authController.login
);

router.patch(
  "/forgotPassword",
  [check("email").normalizeEmail().isEmail()],
  shareController.validation,
  authController.forgotPassword
);

router.patch(
  "/updatePassword",
  [
    check("password").isLength({ min: 6 }),
    check("newPassword").isLength({ min: 6 }),
    check("confirmNewPassword").isLength({ min: 6 }),
  ],
  shareController.validation,
  authController.authUserByToken,
  authController.updatePassword
);

router.get("/verifyEmail/:token", authController.verifyEmail);

export default router;
