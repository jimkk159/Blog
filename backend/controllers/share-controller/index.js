import bcrypt from "bcryptjs";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";
import normalize from "normalize-path";
import HttpError from "../../models/http-error.js";
import { validationResult } from "express-validator";
import querystring from "node:querystring";

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
  const { content, map } = req.body;

  //No need to replace Image
  if (!map) {
    res.locals.content = content;
    return next();
  }
  let imgMap = map;
  if (!Array.isArray(map)) {
    imgMap = [map];
  }

  //Replace Images src
  let postContent;
  try {
    const newContent = JSON.parse(content);
    const newEntityMap = newContent?.entityMap;

    // Unprocessable ContentState
    if (!newEntityMap) {
      return next(new HttpError("Create New Post Failed!", 422));
    }

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

    postContent = JSON.stringify(newContent);

    // Unprocessable EditorState
    if (!postContent) {
      return next(new HttpError("Create New Post Failed!", 422));
    }
  } catch (err) {
    const error = new HttpError("Create New Post Failed!", 500);
    return next(error);
  }

  res.locals.content = postContent;
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

//Check Password
export const checkPassword = async (req, res, next) => {
  const { password } = req.body;
  const user = res.locals.user;
  //Check Password Valid
  let valid = false;
  try {
    valid = await bcrypt.compare(password, user.password);
  } catch (err) {
    const error = new HttpError("Valid credentials fail", 500);
    return next(error);
  }

  if (!valid) {
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
  const { email } = req.body;

  //Setting Avatar
  let avatar;
  if (req.file?.path) {
    avatar = normalize(req.file.path);
  } else {
    avatar = gravatar.url(email, { protocol: "https", d: "identicon" });
  }
  res.locals.avatar = avatar;
  next();
};

export const responseHttp = (req, res, next) => {
  const response = res.locals.response;
  res.status(200).json(response);
};

export const redirectOauth = (req, res, next) => {
  console.log("Oauth Success");
  //Remove the user info in session, we don't need it
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    const queryString = querystring.stringify(res.locals.response);
    res.redirect(process.env.CLIENT_URL + "/oauth/success/?" + queryString);
  });
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
};
//reference: https://stackoverflow.com/questions/72336177/error-reqlogout-requires-a-callback-function
