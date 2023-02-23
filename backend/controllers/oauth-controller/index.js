import gravatar from "gravatar";
import { getDBUser, getDBUserByEmail } from "../../database/mysql/user/read.js";
import { createDBUserSocial } from "../../database/mysql/user/create.js";
import { getDBSocialByParams } from "../../database/mysql/social/read.js";
import { createDBSocial } from "../../database/mysql/social/create.js";
import HttpError from "../../models/http-error.js";

const oauthGoogle = async (accessToken, refreshToken, profile, cb) => {
  let user;
  let cridential;

  if (!profile.emails || !profile.emails.length || !profile?.displayName) {
    cb(new HttpError("Create Account Failed! Please try again later", 500));
  }

  try {
    cridential = await getDBSocialByParams(profile.provider, profile.id);
  } catch (err) {
    cb(new HttpError("Create Account Failed! Please try again later", 500));
  }

  if (!cridential) {
    try {
      user = await getDBUserByEmail(profile.email);
      if (!user) {
        const newUser = {
          name: profile?.displayName,
          email: profile?.emails[0].value,
          avatar: gravatar.url(profile?.emails[0].value, { protocol: "https", d: "identicon" }),
          provider: profile?.provider,
          sercrect: profile?.id,
        };
        user = await createDBUserSocial(newUser);
      } else {
        await createDBSocial(user.id, profile.provider, profile.id);
      }
    } catch (err) {
      console.log(err);
      cb(new HttpError("Create Account Failed! Please try again later", 500));
    }
  } else {
    try {
      user = await getDBUser(cridential.user_id);
    } catch (err) {
      cb(new HttpError("Create Account Failed! Please try again later", 500));
    }
  }
  return cb(null, user);
};

const checkSessionUser = (req, res, next) => {
  if (!req?.session?.passport?.user) {
    return next(
      new HttpError("Login Google Failed! Please try again later", 500)
    );
  }
  res.locals.user = {
    ...req.session.passport.user,
    theme: null,
    language: null,
  };
  next();
};

export default { oauthGoogle, checkSessionUser };
