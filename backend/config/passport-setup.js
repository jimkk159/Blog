import passport from "passport";
import passportGoogle from "passport-google-oauth20";

import * as oauthController from "../controllers/oauth-controller.js";

const GoogleStrategy = passportGoogle.Strategy;

//Serialize the user data of session to req.session.passport.user
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    });
  });
});

//Deserialize req.session.passport.user to user obj
passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.APP_ENV === "dev"
          ? "/api/v1/oauth/google/redirect"
          : process.env.SERVER_URL + "/api/v1/oauth/google/redirect",
    },
    oauthController.oauthGoogle
  )
);

export default passport;
