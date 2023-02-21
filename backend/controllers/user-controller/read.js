import HttpError from "../../models/http-error.js";
import {
  getDBUser,
  getDBFullUser,
  getDBUsers,
  getDBUserByEmail,
} from "../../database/mysql/user/read.js";
import { getDBPrefer } from "../../database/mysql/prefer/read.js";
import { getDBLocal } from "../../database/mysql/social/read.js";

//Get User
export const identifyUser = async (req, res, next) => {
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
export const getUser = async (req, res, next) => {
  //Find User
  console.log("GET USER");
  const uid = req.params.uid;
  let user;
  try {
    user = await getDBFullUser(uid);
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
  res.locals.response = user;
  next();
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
  res.locals.response = users;
  next();
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
  next();
};

//Get User Local Info
export const getUserLocal = async (req, res, next) => {
  const user = res.locals.user;

  let local;
  try {
    local = await getDBLocal(user?.id);
    if (!local)
      throw new HttpError(
        "Local information not exist! Please Login by Google.",
        500
      );
  } catch (err) {
    const error = new HttpError(
      "Finding user prefer failed, please try again later.",
      500
    );
    return next(error);
  }

  res.locals.user = { ...user, password: local.secrect };
  next();
};

//Get Prefer by User
export const getUserPrefer = async (req, res, next) => {
  const user = res.locals.user;

  let prefer;
  try {
    prefer = await getDBPrefer(user?.prefer_id);
  } catch (err) {
    const error = new HttpError(
      "Finding user prefer failed, please try again later.",
      500
    );
    return next(error);
  }

  res.locals.user = { ...user, theme: prefer.theme, language: prefer.language };
  next();
};

//Check Admin
export const checkAdmin = async (req, res, next) => {
  const { uid } = req.userData;

  let isAdmin = false;
  let user;
  try {
    user = await getDBUser(uid);
    isAdmin = !!+user.admin;
  } catch (err) {
    const error = new HttpError(
      "Reading user permission from database failed, please try again.",
      500
    );
    return next(error);
  }

  res.locals.admin = isAdmin;
  next();
};

export default {
  identifyUser,
  getUser,
  getUsers,
  getUserbyEmail,
  getUserLocal,
  getUserPrefer,
  checkAdmin
};
