import { getDBPostSearch } from "../../database/mysql/post/read.js";

import HttpError from "../../models/http-error.js";

// ToDo author
export const getPostSearch = async (req, res, next) => {
  //For Debug
  const searchTarget = req.query.search;
  let result = [];

  try {
    result = await getDBPostSearch(searchTarget, 5);
    if (!result) result = [];
  } catch (err) {
    const error = new HttpError(
      "Search Posts Error!, please try again later.",
      500
    );
    return next(error);
  }

  res.locals.response = result;
  next();
};
