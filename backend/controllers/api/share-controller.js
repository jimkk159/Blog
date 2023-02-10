import bcrypt from "bcryptjs";
import normalize from "normalize-path";
import { validationResult } from "express-validator";

import jwt from "jsonwebtoken";
import HttpError from "../../models/http-error.js";

import { getDBUser } from "../database/mysql.js";

export const validation = (req, res, next) => {
  //Validate the req
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs, please check your input is correct", 422)
    );
  }
  next();
};

export const replaceImageSrc = async (req, res, next) => {
  const { contentState } = req.body;
  
  //Replace Images src
  let postContentState;
  try {
    const newContentState = JSON.parse(contentState);
    const newEntityMap = newContentState?.entityMap;

    // Unprocessable ContentState
    if (!newEntityMap) {
      return next(new HttpError("Create New Post Failed!", 422));
    }

    //Change Image
    if (req?.files?.images) {
      req.files.images.map((file, index) => {
        newEntityMap[index].data.src = normalize(file.path);
      });
    }
    postContentState = JSON.stringify(newContentState);

    // Unprocessable EditorState
    if (!postContentState) {
      return next(new HttpError("Create New Post Failed!", 422));
    }
  } catch (err) {
    const error = new HttpError("Create New Post Failed!", 500);
    return next(error);
  }
  res.locals.contentState = postContentState;
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

//Hash Password
export const encryptPassword = async (req, res, next) => {
  const { password } = req.body;
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash("" + password, 12);
  } catch (err) {
    const error = new HttpError("Encrypt fail, please try again.", 500);
    return next(error);
  }
  res.locals.password = hashedPassword;
  next();
};

//Check Email if exist
export const checkPassword = async (req, res, next) => {
  const { password } = req.body;
  const existingUser = res.locals.user_by_email;

  //Check Password Valid
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError("Valid credentials fail", 500);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("Invalid credentials.", 401);
    return next(error);
  }
  next();
};

//Generate Json Web Token
export const generateToken = (req, res, next) => {
  const user = res.locals.user;
  //Create Token
  let token;
  try {
    token = jwt.sign({ uid: user.id, email: user.email }, process.env.JWT_KEY, {
      expiresIn: "3h",
    });
  } catch (err) {
    const error = new HttpError(
      "Create Token fail, please try again later.",
      500
    );
    return next(error);
  }
  res.locals.token = token;
  next();
};

//Generate Avatar URI
export const createAvatar = (req, res, next) => {
  //Setting Avatar
  let avatar;
  if (req.file?.path) {
    avatar = normalize(req.file.path);
  } else {
    avatar = "upload/images/default/default_avatar.png";
  }
  res.locals.avatar = avatar;
  next();
};

export const responseHttp = async (req, res, next) => {
  const response = res.locals.response;
  res.status(200).json(response);
};
