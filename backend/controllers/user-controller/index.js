import HttpError from "../../models/http-error.js";
import * as create from "./create.js";
import * as read from "./read.js";

//Check Email if exist
const checkIsUser = async (req, res, next) => {
  //Check if the User Exist
  if (!res.locals.user) {
    const error = new HttpError("Email not found!", 403);
    return next(error);
  }
  next();
};

//Check Email if not exist
const checkIsUserEmpty = async (req, res, next) => {
  if (!!res.locals.user) {
    const error = new HttpError(
      "Email existed already, please login instead.",
      422
    );
    return next(error);
  }
  next();
};

//SignUp
const signup = async (req, res, next) => {
  console.log("Sign Up");
  const user = res.locals.user;
  const token = res.locals.token;

  res.locals.response = {
    uid: user.id,
    admin: user.admin,
    name: user.name,
    avatar: user.avatar,
    theme: user.theme,
    language: user.language,
    token: token,
  };
  next();
};

//Login
const login = async (req, res, next) => {
  console.log("Login");
  const user = res.locals.user;
  const token = res.locals.token;
  res.locals.response = {
    uid: user.id,
    admin: user.admin,
    name: user.name,
    avatar: user.avatar,
    theme: user.theme,
    language: user.language,
    token: token,
  };
  next();
};

export default {
  ...create,
  ...read,
  checkIsUser,
  checkIsUserEmpty,
  signup,
  login,
};
