import normalize from "normalize-path";
import { v4 as uuidv4 } from "uuid";

import { users as dummy_users } from "./blogs.js";
import HttpError from "../models/http-error.js";

//Get Specific User
export const getUser = async (req, res, next) => {
  //Find User
  const { userId } = req.userData;
  let findingUser;
  try {
    findingUser = dummy_users.filter((user) => user.id === userId)[0];
  } catch (err) {
    const error = new HttpError(
      "Finding user failed, please try again later.",
      500
    );
    return next(error);
  }

  //User not find
  if (!findingUser) {
    const error = new HttpError(
      "User not exists, singup an account first.",
      422
    );
    return next(error);
  }
  res.locals.user = findingUser;
  next();
};

//Get Random Users
export const getUsers = async (req, res, next) => {
  let users;
  try {
    users = dummy_users;
  } catch (err) {
    const error = new HttpError(
      "Fetching users from database fail, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    users,
  });
};

//Get User by Email
export const getUserbyEmail = async (req, res, next) => {
  //Find User
  const { email } = req.body;

  //Check User if exist
  let existingUser;
  try {
    existingUser = dummy_users.filter((user) => email === user.email)[0];
  } catch (err) {
    const error = new HttpError(
      "Finding email failed, please try again later.",
      500
    );
    return next(error);
  }
  res.locals.user_by_email = existingUser;
  next();
};

//Check Email if exist
export const getIsEmailEmpty = async (req, res, next) => {
  const existingUser = res.locals.user_by_email;
  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }
  next();
};

//Check Email if exist
export const checkUserExist = async (req, res, next) => {
  const existingUser = res.locals.user_by_email;
  //Check if the User Exist
  if (!existingUser) {
    const error = new HttpError("User not found!", 403);
    return next(error);
  }
  next();
};

//Create New User
export const createNewUser = async (req, res, next) => {
  const { name, email } = req.body;
  const password = res.locals.password;

  //Check Admin
  let admin = false;
  if (dummy_users.length === 0) {
    admin = true;
  }

  //Create User
  let newUser;
  const avatarPath = normalize(req.file.path);
  try {
    newUser = {
      id: uuidv4(),
      admin,
      name,
      email,
      avatar: avatarPath,
      password,
    };
    dummy_users.push(newUser);
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

export const transformUser = async (req, res, next) => {
  const existingUser = res.locals.user_by_email;
  res.locals.user = existingUser;
  next();
};

//SignUp
export const signup = async (req, res, next) => {
  console.log("Sign Up");
  const token = res.locals.token;
  const newUser = res.locals.user;

  res.status(201).json({
    userId: newUser.id,
    admin: newUser.admin,
    name: newUser.name,
    avatar: newUser.avatar,
    token: token,
  });
};

export const login = async (req, res, next) => {
  console.log("Login");
  const user = res.locals.user;
  const token = res.locals.token;

  res.json({
    userId: user.id,
    admin: user.admin,
    name: user.name,
    avatar: user.avatar,
    token: token,
  });
};
