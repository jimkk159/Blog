import HttpError from "../utils/http-error.js";
import queryPool from "../module/mysql/pool.js";
import catchAsync from "../utils/catch-async.js";

//SignUp
const signup = async (req, res, next) => {
  const token = res.locals.token;
  res.locals.response = {
    id: req.user.id,
    name: req.user.name,
    role: req.user.role,
    avatar: req.user.avatar,
    token: token,
  };
  next();
};

//Login
const login = async (req, res, next) => {
  const token = res.locals.token;
  res.locals.response = {
    id: req.user.id,
    name: req.user.name,
    role: req.user.role,
    avatar: req.user.avatar,
    token: token,
  };
  next();
};

//-----------------Get---------------------
//Identify User
export const identifyUser = catchAsync(async (req, res, next) => {
  const user = await queryPool.getOne("user", "id", req.user.id);
  if (!user)
    throw new HttpError("User not exists, singup an account first.", 422);
  req.user = { ...req.user, ...user };
  next();
});

//Identify Email
export const identifyEmail = (condition) =>
  catchAsync(async (req, res, next) => {
    const user = await queryPool.getOne("user", "email", req.body.email);

    //Check User if exist
    if (condition === "exist" && !user) {
      return next(new HttpError("Email not found!", 403));
    } else if (condition === "empty" && !!user) {
      return next(
        new HttpError("Email existed already, please login instead.", 422)
      );
    }

    req.user = { ...req.user, ...user };
    next();
  });

//Get User Secrect
export const getUserSecrect = (provider) =>
  catchAsync(async (req, res, next) => {
    const result = await queryPool.getOneMulti(
      `auth`,
      ["provider", "user_id"],
      [provider, req.user.id]
    );
    if (!result)
      throw new HttpError("No such user, Please check your input.", 500);
    req.user = { ...req.user, password: result.password };
    next();
  });

export default {
  signup,
  login,
  identifyUser,
  identifyEmail,
  getUserSecrect,
};
