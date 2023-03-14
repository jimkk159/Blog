import express from "express";
import passport from "passport";
import { check } from "express-validator";
import fileUploadToServer from "../utils/file-upload.js";

import authController from "../controllers/auth-controller.js";
import oauthController from "../controllers/oauth-controller.js";
import shareController from "../controllers/share-controller.js";

const router = express.Router();

//---------------Local--------------------
router.post(
  "/signup",
  fileUploadToServer.single("avatar"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
    check("confirmPassword").isLength({ min: 6 }),
  ],
  shareController.validation,
  authController.signup("user")
);

router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  shareController.validation,
  authController.login
);
router.get("/logout", authController.logout);

router.post("/forgotPassword", authController.forgotPassword);

//---------------Google-------------------
// auth with google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// redirect to home page after successfully login via twitter
router.get(
  "/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "/auth/google/failed",
  }),
  oauthController.setSessionUser,
  oauthController.setOauth,
  oauthController.redirectOauth
);

// when login failed, send failed msg
router.get("/google/failed", (req, res) => {
  res.status(401).json({
    message: "Login by google failed!",
  });
});

router.use(authController.authToken);
router.patch("/updatePassword", authController.updatePassword);

export default router;
//Reference: https://alexanderleon.medium.com/implement-social-authentication-with-react-restful-api-9b44f4714fa
//Reference: https://medium.com/free-code-camp/how-to-set-up-twitter-oauth-using-passport-js-and-reactjs-9ffa6f49ef0
