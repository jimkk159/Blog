import gravatar from "gravatar";
import queryPool from "../module/mysql/pool.js";
import { createOneUser } from "../module/mysql/user-model.js";
import catchAsync from "../utils/catch-async.js";
import HttpError from "../utils/http-error.js";

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
      `auth`,
      [`provider`, `password`],
      [profile.provider, profile.id]
    );

    //Has Oauth Account
    if (oauth) {
      user = await queryPool.getOne(`user`, "id", cridential.user_id);
      return cb(null, user);
    }

    //Has Local Account
    user = await queryPool.getOne(`user`, `email`, profile.email);
    if (user) {
      const insertId = await queryPool.createOne(
        `auth`,
        [`user_id`, `provider`, `password`],
        [user.id, profile.provider, profile.id]
      );
      user = await queryPool.getOne(`user`, `id`, insertId);
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

export default { oauthGoogle, setSessionUser };
