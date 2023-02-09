import jwt from "jsonwebtoken";

import HttpError from "../models/http-error.js";

const checkAuth = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; //Authorization: 'Bearer TOKEN
    if (!token) {
      throw new HttpError("Auythentication failed!", 403);
    }
    const decodeToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { uid: decodeToken.uid };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed!", 403);
    return next(error);
  }
};

export default checkAuth;
