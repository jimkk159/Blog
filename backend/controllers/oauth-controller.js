import querystring from "node:querystring";

import User from "../module/user.js";
import * as authHelper from "../utils/helper/auth-helper.js";
import * as errorTable from "../utils/error/error-table.js";
import * as shareController from "../controllers/share-controller.js";
import catchAsync, { catchAsyncFunc } from "../utils/error/catch-async.js";

export const oauthGoogle = catchAsyncFunc(
  async (accessToken, refreshToken, profile, cb) => {
    let user;
    let oauth;

    // 1) Check incoming profile data has email & display name
    if (!profile.emails || !profile.emails.length || !profile?.displayName) {
      return cb(errorTable.loginFailError(), null);
    }
    const authInfo = { password: profile.id, provider: "google" };

    // 2) Check user is existed by email
    user = await User.findOne({
      where: { email: profile.emails[0].value },
      attributes: { include: ["role"] },
    });

    // 3) Create User if not exist,
    if (!user) {
      const userInfo = {
        name: profile.displayName,
        email: profile.emails[0].value,
        role: user.toJSON().role,
        avatar: shareController.createAvatar(profile.emails[0].value),
      };
      user = await authHelper.createUserAndAuth(userInfo, authInfo);
      return cb(null, user.toJSON());
    }

    // 4) Get the oauth information from user
    oauth = await user.getAuths({ where: { provider: "google" }, raw: true });

    // 5) User doesn't have oauth information
    if (!oauth.length) await user.createAuth(authInfo);

    return cb(null, user);
  }
);

export const redirectOauth = catchAsync((req, res, next) => {
  // 1) Set session info to user
  req.user = { ...req.session.passport.user };
  // 2) Generate token
  const token = authHelper.generateToken(req.user.id, req.user.email);

  // 3) create token cookie
  authHelper.createTokenCookie(req, res, token);

  const userInfo = {
    id: req.user.id,
    name: req.user.name,
    role: req.user.role,
    avatar: req.user.avatar,
    token,
  };

  // 4) Remove the user info in session, we don't need it
  req.logout((err) => {
    if (err) return next(err);

    // 5) Save the info in search params and redirect
    const oauthInfo = querystring.stringify(userInfo);
    res.redirect(process.env.CLIENT_URL + "/oauth/success/?" + oauthInfo);
  });
});
