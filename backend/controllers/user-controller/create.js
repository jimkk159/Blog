import HttpError from "../../models/http-error.js";
import { createDBUser } from "../../database/mysql/user/create.js";
import { getDBPreferByParams } from "../../database/mysql/prefer/read.js";
import { createDBPrefer } from "../../database/mysql/prefer/create.js";

//Create New User
export const createNewUser = async (req, res, next) => {
  const { name, email, theme, language } = req.body;
  const { password, avatar } = res.locals;

  //Creat Prefer
  let prefer;
  let preferId;
  try {
    prefer = await getDBPreferByParams({ theme, language });
    //In not the Perfer, create it
    if (!prefer) prefer = await createDBPrefer({ theme, language });

    preferId = prefer?.id;

    if (!preferId) {
      return next(
        new HttpError(
          "Create Perfer to database fail, please try again later.",
          500
        )
      );
    }
  } catch (err) {
    const error = new HttpError(
      "Create Perfer to database fail, please try again later.",
      500
    );
    return next(error);
  }

  //Create User
  let newUser;
  try {
    newUser = {
      name,
      email,
      avatar,
      password,
      preferId,
    };
    newUser = await createDBUser(newUser);
    newUser = { ...newUser, theme: prefer.theme, language: prefer.language };
  } catch (err) {
    const error = new HttpError(
      "Create User to database fail, please try again later.",
      500
    );
    return next(error);
  }

  res.locals.user = newUser;
  next();
};
