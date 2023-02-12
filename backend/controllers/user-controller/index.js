import HttpError from "../../models/http-error.js";
export * from "./create.js";
export * from "./read.js";


//Check Email if exist
export const getIsEmail = async (req, res, next) => {
  const is_email = !!res.locals.is_email;
  //Check if the User Exist
  if (!is_email) {
    const error = new HttpError("Email not found!", 403);
    return next(error);
  }
  next();
};

//Check Email if exist
export const getIsEmailEmpty = async (req, res, next) => {
  const is_email = !!res.locals.is_email;
  if (is_email) {
    const error = new HttpError(
      "Email existed already, please login instead.",
      422
    );
    return next(error);
  }
  next();
};

//SignUp
export const signup = async (req, res, next) => {
  console.log("Sign Up");
  const user = res.locals.user;
  const token = res.locals.token;
  res.locals.response = {
    uid: user.id,
    admin: user.admin,
    name: user.name,
    avatar: user.avatar,
    token: token,
  };
  next();
};

//Login
export const login = async (req, res, next) => {
  console.log("Login");
  const user = res.locals.user;
  const token = res.locals.token;
  res.locals.response = {
    uid: user.id,
    admin: user.admin,
    name: user.name,
    avatar: user.avatar,
    token: token,
  };
  next();
};
