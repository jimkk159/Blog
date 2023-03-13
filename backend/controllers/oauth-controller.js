import gravatar from "gravatar";
import querystring from "node:querystring";
import HttpError from "../utils/http-error.js";
import queryPool from "../module/mysql/pool.js";
import catchAsync from "../utils/catch-async.js";
import { createOneUser } from "../module/mysql/user-model.js";
import {
  id_,
  user_,
  email_,
  auth_,
  user_id_,
  provider_,
  password_,
} from "../utils/table.js";
import authHelper from "../utils/auth-helper.js";

const oauthGoogle = catchAsync(
  async (accessToken, refreshToken, profile, cb) => {
    let user;
    let oauth;

    // 1) Check incoming profile data has email & display name
    if (!profile.emails || !profile.emails.length || !profile?.displayName) {
      return cb(
        new HttpError("Login failed! Please try again later...", 500),
        null
      );
    }

    // 2) Check if the social profile has existed
    oauth = await queryPool.getOne(
      auth_,
      [provider_, password_],
      [profile.provider, profile.id]
    );

    // 3) Get the user information by oauth
    if (oauth) {
      user = await queryPool.getOne(user_, [id_], [oauth.user_id]);
      return cb(null, user);
    }

    // 4) User doesn't have oauth information
    user = await queryPool.getOne(user_, [email_], [profile.email]);

    // 5) Create oauth information for the user
    if (user) {
      const insertId = await queryPool.createOne(
        auth_,
        [user_id_, provider_, password_],
        [user.id, profile.provider, profile.id]
      );
      // 6) Get the user information
      user = await queryPool.getOne(user_, [id_], [insertId]);
      return cb(null, user);
    }

    // 7) User doesn't have any account, create a new account for him
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

    // 8) Create account has something wrong happen
    if (!user)
      return cb(
        new HttpError("Login failed! Please try again later...", 500),
        null
      );
    return cb(null, user);
  }
);

// 9) Set information from the session to req user
const setSessionUser = (req, res, next) => {
  if (!req.user) req.user = { ...req.user, ...req.session.passport.user };
  next();
};

const setOauth = (req, res, next) => {
  // 1) Generate token
  const token = authHelper.generateToken(req.user.id, req.user.email);

  // 2) create token cookie
  authHelper.createTokenCookie(req, res, token);

  res.locals.oauth = {
    id: req.user.id,
    name: req.user.name,
    role: req.user.role,
    avatar: req.user.avatar,
    token,
  };
};

const redirectOauth = (req, res, next) => {
  // 1) Remove the user info in session, we don't need it
  req.logout((err) => {
    if (err) return next(err);

    // 2) Send the info by req query
    const queryString = querystring.stringify(res.locals.oauth);
    res.redirect(process.env.CLIENT_URL + "/oauth/success/?" + queryString);
  });
};

export default { oauthGoogle, setSessionUser, setOauth, redirectOauth };
