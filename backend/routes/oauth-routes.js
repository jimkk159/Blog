import express from "express";
import passport from "passport";

import * as oauthController from "../controllers/oauth-controller.js";

const router = express.Router();

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
    failureRedirect: "/api/v1/blog/oauth/google/failed",
  }),
  oauthController.redirectOauth
);

// when login failed, send failed msg
router.get("/google/failed", (req, res) => {
  res.status(401).json({
    status: "fail",
    message: "Login by google failed!",
  });
});

export default router;
