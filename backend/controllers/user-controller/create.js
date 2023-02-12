import HttpError from "../../models/http-error.js";
import { createDBUser } from "../../database/mysql/user/create.js";

//Create New User
export const createNewUser = async (req, res, next) => {
  const { name, email } = req.body;
  const { password, avatar } = res.locals;

  //Create User
  let newUser;
  try {
    newUser = {
      name,
      email,
      avatar,
      password,
    };
    newUser = await createDBUser(newUser);
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
