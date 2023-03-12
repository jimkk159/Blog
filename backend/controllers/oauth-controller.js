import gravatar from "gravatar";
import querystring from "node:querystring";
import queryPool from "../module/mysql/pool.js";
import { createOneUser } from "../module/mysql/user-model.js";
import catchAsync from "../utils/catch-async.js";
import HttpError from "../utils/http-error.js";
import {
  id_,
  user_,
  email_,
  auth_,
  user_id_,
  provider_,
  password_,
} from "../utils/table.js";
import authController from "./auth-controller.js";

const oauthGoogle = catchAsync(
  async (accessToken, refreshToken, profile, cb) => {
    let user;
    let oauth;
    if (!profile.emails || !profile.emails.length || !profile?.displayName) {
      return cb(
        new HttpError("Login failed! Please try again later...", 500),
        null
      );
    }

    oauth = await queryPool.getOneMulti(
      auth_,
      [provider_, password_],
      [profile.provider, profile.id]
    );

    //Has Oauth Account
    if (oauth) {
      user = await queryPool.getOne(user_, id_, cridential.user_id);
      return cb(null, user);
    }

    //Has Local Account
    user = await queryPool.getOne(user_, email_, profile.email);
    if (user) {
      const insertId = await queryPool.createOne(
        auth_,
        [user_id_, provider_, password_],
        [user.id, profile.provider, profile.id]
      );
      user = await queryPool.getOne(user_, id_, insertId);
      return cb(null, user);
    }

    //Create Oauth Account
    user = await createOneUser({
      name: profile?.displayName,
      email: profile?.emails[0].value,
      avatar: gravatar.url(profile?.emails[0].value, {
        protocol: "https",
        d: "identicon",
      }),
      provider: profile?.provider,
      password: profile?.id,
    });

    if (!user)
      return cb(
        new HttpError("Login failed! Please try again later...", 500),
        null
      );
    return cb(null, user);
  }
);

const setSessionUser = (req, res, next) => {
  if (!req.user) req.user = { ...req.user, ...req.session.passport.user };
  next();
};

const setOauth = (req, res, next) => {
  
  // 1) Generate token
  res.locals.token = authController.generateToken(req.user.id, req.user.email);

  // 2) create token cookie
  createTokenCookie(req, res);

  const token = res.locals.token;
  if (res.locals.token) delete res.locals.token;
  if (req.user.password) delete req.user.password;
  if (req.body.password) delete req.body.password;

  res.locals.response = {
    id: req.user.id,
    name: req.user.name,
    role: req.user.role,
    avatar: req.user.avatar,
    token,
  };
};

const redirectOauth = (req, res, next) => {
  //Remove the user info in session, we don't need it
  req.logout((err) => {
    if (err) return next(err);
    const queryString = querystring.stringify(res.locals.response);
    res.redirect(process.env.CLIENT_URL + "/oauth/success/?" + queryString);
  });
};

export default { oauthGoogle, setSessionUser, setOauth, redirectOauth };
