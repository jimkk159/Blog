import {
  getDBUser,
  getDBUsers,
  getDBUserByEmail,
  createDBUser,
} from "../database/mysql.js";

import HttpError from "../../models/http-error.js";

//Get User
export const getUser = async (req, res, next) => {
  const { uid } = req.userData;

  let user;
  try {
    user = await getDBUser(uid);
  } catch (err) {
    const error = new HttpError(
      "Finding user failed, please try again later.",
      500
    );
    return next(error);
  }

  //User not find
  if (!user) {
    const error = new HttpError(
      "User not exists, singup an account first.",
      422
    );
    return next(error);
  }
  res.locals.user = user;
  next();
};

//Get User Params
export const getUserbyParams = async (req, res, next) => {
  //Find User
  console.log("GET USER");
  const uid = req.params.uid;
  let user;
  try {
    user = await getDBUser(uid);
  } catch (err) {
    const error = new HttpError(
      "Finding user failed, please try again later.",
      500
    );
    return next(error);
  }

  //User not find
  if (!user) {
    const error = new HttpError(
      "User not exists, singup an account first.",
      422
    );
    return next(error);
  }
  res.locals.user = user;
  res.status(200).json(user);
};

//Get Random Users
export const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await getDBUsers();
  } catch (err) {
    const error = new HttpError(
      "Fetching users from database fail, please try again later.",
      500
    );
    return next(error);
  }
  res.json(users);
};

//Get User by Email
export const getUserbyEmail = async (req, res, next) => {
  //Find User
  const { email } = req.body;

  //Check User if exist
  let user;
  try {
    user = await getDBUserByEmail(email);
  } catch (err) {
    const error = new HttpError(
      "Finding email failed, please try again later.",
      500
    );
    return next(error);
  }
  res.locals.user = user;
  res.locals.is_email = !!user;
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

//Create New User
export const createNewUser = async (req, res, next) => {
  const { name, email } = req.body;
  const { password, avatar } = res.locals;

  //Create User
  let newUser;
  try {
    newUser = {
      name,
      email,
      avatar,
      password,
    };
    newUser = await createDBUser(newUser);
  } catch (err) {
    const error = new HttpError(
      "Create User to database fail, please try again later.",
      500
    );
    return next(error);
  }
  res.locals.user = newUser;
  next();
};

//SignUp
export const signup = async (req, res, next) => {
  console.log("Sign Up");
  const token = res.locals.token;
  const user = res.locals.user;

  res.status(201).json({
    uid: user.id,
    admin: user.admin,
    name: user.name,
    avatar: user.avatar,
    token: token,
  });
};

//Login
export const login = async (req, res, next) => {
  console.log("Login");
  const user = res.locals.user;
  const token = res.locals.token;

  res.json({
    uid: user.id,
    admin: user.admin,
    name: user.name,
    avatar: user.avatar,
    token: token,
  });
};

export const responseResult = async (req, res, next) => {
  res.json({ result: res.locals.is_email });
};
