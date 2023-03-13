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
  // 1) No need to replace Image
  if (!map) return detail;

  // 2) Parse the image map type
  let imgMap = map;
  if (!Array.isArray(map)) imgMap = [map];

  // 3) Get the post detail
  const newContent = JSON.parse(detail);
  const newEntityMap = newContent?.entityMap;

  // 4) Not satisfy the draft.js entity type
  if (!newEntityMap) throw new HttpError("Create New Post Failed!", 422);

  // 5) Replace image src
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

  // 6) Restore the draft.js content to string
  let resultDetail = JSON.stringify(newContent);

  // 7) Type convert fail
  if (!resultDetail) throw new HttpError("Create New Post Failed!", 422);

  return resultDetail;
};

//Generate Avatar URI
export const createAvatar = (email, file) => {
  // 1) Normalize avatar path
  if (file?.path) return normalize(file.path);
  // 2) Create a gravatar instead
  else
    return gravatar.url(email, {
      protocol: "https",
      d: "identicon",
    });
};

//Restrict Role
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
