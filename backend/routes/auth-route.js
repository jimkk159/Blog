import express from "express";
import passport from "passport";
import { check } from "express-validator";
import fileUploadToServer from "../middleware/file-upload.js";

import oauth from "../controllers/oauth-controller/index.js";

import userController from "../controllers/user-controller/index.js";

import shareController from "../controllers/share-controller/index.js";

const router = express.Router();

//---------------Local--------------------
router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  shareController.validation,
  userController.getUserbyEmail,
  userController.checkIsUser,
  userController.getUserLocal,
  userController.getUserPrefer,
  shareController.checkPassword,
  shareController.generateToken,
  userController.login,
  shareController.responseHttp
);

router.post(
  "/signup",
  fileUploadToServer.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
    check("theme").not().isEmpty(),
    check("language").not().isEmpty(),
  ],
  shareController.validation,
  userController.getUserbyEmail,
  userController.checkIsUserEmpty,
  shareController.encryptPassword,
  shareController.createAvatar,
  userController.createLocalUser,
  shareController.generateToken,
  userController.signup,
  shareController.responseHttp
);

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
  oauth.checkSessionUser,
  shareController.generateToken,
  userController.login,
  shareController.redirectOauth
);

// when login failed, send failed msg
router.get("/google/failed", (req, res) => {
  res.status(401).json({
    message: "Login by google failed!",
  });
});

export default router;
//Reference: https://alexanderleon.medium.com/implement-social-authentication-with-react-restful-api-9b44f4714fa
//Reference: https://medium.com/free-code-camp/how-to-set-up-twitter-oauth-using-passport-js-and-reactjs-9ffa6f49ef0
