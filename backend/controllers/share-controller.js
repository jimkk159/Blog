import bcrypt from "bcryptjs";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";
import normalize from "normalize-path";
import HttpError from "../utils/http-error.js";
import { validationResult } from "express-validator";
import querystring from "node:querystring";
import catchAsync from "../utils/catch-async.js";

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

export const replaceImageSrc = catchAsync(async (req, res, next) => {
  //No need to replace Image
  if (!req.body.map) {
    res.locals.detail = req.body.detail;
    return next();
  }

  let imgMap = req.body.map;
  if (!Array.isArray(req.body.map)) imgMap = [req.body.map];

  //Replace Images src
  const newContent = JSON.parse(req.body.detail);
  const newEntityMap = newContent?.entityMap;
  // Unprocessable ContentState
  if (!newEntityMap) return next(new HttpError("Create New Post Failed!", 422));

  //Change Image
  if (req?.files?.images) {
    let count = 0;
    let imgCount = 0;
    for (let i = 0; i < Object.keys(newEntityMap).length; i++) {
      if (newEntityMap[i]?.type === "IMAGE") {
        if (+imgMap[count] === 1) {
          newEntityMap[i].data.src = `${process.env.SERVER_URL}${
            process.env.port
          }/${normalize(req.files.images[imgCount].path)}`;
          imgCount++;
        }
        count++;
      }
    }
  }

  let detail = JSON.stringify(newContent);
  // Unprocessable EditorState
  if (!detail) return next(new HttpError("Create New Post Failed!", 422));

  res.locals.detail = detail;
  next();
});

//Hash Password
export const encryptPassword = async (req, res, next) => {
  try {
    res.locals.password = await bcrypt.hash("" + req.body.password, 12);
  } catch (err) {
    return next(new HttpError("Encrypt fail, please try again.", 500));
  }
  next();
};

//Check Password
export const checkPassword = async (req, res, next) => {
  //Check Password Valid
  let valid = false;
  try {
    valid = await bcrypt.compare(req.body.password, req.user.password);
  } catch (err) {
    return next(new HttpError("Valid credentials fail", 500));
  }

  if (!valid) return next(new HttpError("Invalid credentials.", 401));
  next();
};

//Generate Json Web Token
export const generateToken = (req, res, next) => {
  //Create Token
  try {
    res.locals.token = jwt.sign(
      { uid: req.user.id, email: req.user.email },
      process.env.JWT_KEY,
      { expiresIn: "3h" }
    );
  } catch (err) {
    return next(
      new HttpError("Create Token fail, please try again later.", 500)
    );
  }
  next();
};

//Generate Avatar URI
export const createAvatar = (req, res, next) => {
  //Setting Avatar
  if (req.file?.path) res.locals.avatar = normalize(req.file.path);
  else
    res.locals.avatar = gravatar.url(req.body.email, {
      protocol: "https",
      d: "identicon",
    });
  next();
};

export const responseHttp = (req, res, next) =>
  res.status(200).json(res.locals.response);

export const redirectOauth = (req, res, next) => {
  //Remove the user info in session, we don't need it
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    const queryString = querystring.stringify(res.locals.response);
    res.redirect(process.env.CLIENT_URL + "/oauth/success/?" + queryString);
  });
};

//Restrict Roule
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new HttpError("Permission deny", 403));
    next();
  };
};

export default {
  validation,
  replaceImageSrc,
  encryptPassword,
  checkPassword,
  generateToken,
  createAvatar,
  responseHttp,
  redirectOauth,
  restrictTo
};
//reference: https://stackoverflow.com/questions/72336177/error-reqlogout-requires-a-callback-function
