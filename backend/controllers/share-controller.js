import gravatar from "gravatar";
import normalize from "normalize-path";
import HttpError from "../utils/http-error.js";
import { validationResult } from "express-validator";
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

//Generate Avatar URI
export const createAvatar = (email, file) => {
  //Setting Avatar
  if (file?.path) return normalize(file.path);
  else
    return gravatar.url(email, {
      protocol: "https",
      d: "identicon",
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

export const responseHttp = (req, res, next) =>
  res.status(200).json(res.locals.response);

//Makesure the response does not have sensitive user informations
export const responseUserHttp = (req, res, next) => {
  if (req.user?.password) delete req.user.password;
  let data = res.locals?.response?.data;
  if (Array.isArray(data)) {
    data = data.map((element) => ({
      id: element.id,
      name: element.name,
      role: element.role,
      avatar: element.avatar,
    }));
  } else {
    data = {
      id: req.user.id,
      name: req.user.name,
      role: req.user.role,
      avatar: req.user.avatar,
    };
  }

  res.status(200).json({
    status: "success",
    data,
  });
};

export default {
  validation,
  replaceImageSrc,
  createAvatar,
  restrictTo,
  responseHttp,
  responseUserHttp,
};
//reference: https://stackoverflow.com/questions/72336177/error-reqlogout-requires-a-callback-function
