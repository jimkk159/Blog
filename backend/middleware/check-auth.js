import jwt from "jsonwebtoken";

import HttpError from "../models/http-error";

const checkAuth = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; //Authorization: 'Bearer TOKEN
    if (!token) {
      throw new HttpError("Aythentication failed!", 403);
    }
    const decodeToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userId: decodeToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Aythentication failed!", 403);
    return next(err);
  }
};

export default checkAuth;
