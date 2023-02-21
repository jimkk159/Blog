import passport from "passport";
import passportGoogle from "passport-google-oauth20";

import oauth from "../controllers/oauth-controller/index.js";

const GoogleStrategy = passportGoogle.Strategy;

//Serialize the user data of session to req.session.passport.user
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      admin: user.admin,
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
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: "/auth/google/redirect",
    },
    oauth.oauthGoogle
  )
);

export default passport;
//reference: https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
