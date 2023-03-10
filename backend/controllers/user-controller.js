import factory from "./handle-factory.js";
import catchAsync from "../utils/catch-async.js";
import { createOneUser } from "../module/mysql/user-model.js";

const table = "user";
//Create Local User
export const createLocalUser = catchAsync(async (req, res, next) => {
  //Create User
  const newUser = await createOneUser({
    name: req.body.name,
    email: req.body.email,
    avatar: res.locals.avatar,
    provider: "local",
    password: res.locals.password,
  });
  
  if (!newUser) {
    return next(
      new HttpError("Create User fail, please try again later.", 500)
    );
  }
  req.user = { ...req.user, ...newUser };
  next();
});

const getAllUsers = factory.getAll(table, ["id", "item", "price", "update"]);
const postUser = factory.createOne(table);
const patchUser = factory.updateOne(table);
const deleteUser = factory.deleteOne(table);

export default {
  getAllUsers,
  createLocalUser,
  postUser,
  patchUser,
  deleteUser,
};
