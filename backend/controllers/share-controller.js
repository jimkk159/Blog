import gravatar from "gravatar";
import normalize from "normalize-path";
import HttpError from "../utils/http-error.js";
import { validationResult } from "express-validator";

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

export const replaceImageSrc = (map, detail, files, host) => {
  //No need to replace Image
  if (!map) return detail;

  let imgMap = map;
  if (!Array.isArray(map)) imgMap = [map];

  //Replace Images src
  const newContent = JSON.parse(detail);
  const newEntityMap = newContent?.entityMap;
  // Unprocessable ContentState
  if (!newEntityMap) throw new HttpError("Create New Post Failed!", 422);

  //Change Image
  if (files?.images) {
    let count = 0;
    let imgCount = 0;
    for (let i = 0; i < Object.keys(newEntityMap).length; i++) {
      if (newEntityMap[i]?.type === "IMAGE") {
        if (+imgMap[count] === 1) {
          newEntityMap[i].data.src = `${host}/${normalize(
            files.images[imgCount].path
          )}`;
          imgCount++;
        }
        count++;
      }
    }
  }

  let resultDetail = JSON.stringify(newContent);

  // Unprocessable EditorState
  if (!resultDetail) throw new HttpError("Create New Post Failed!", 422);

  return resultDetail;
};

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

export default {
  validation,
  replaceImageSrc,
  createAvatar,
  restrictTo,
};
//reference: https://stackoverflow.com/questions/72336177/error-reqlogout-requires-a-callback-function
