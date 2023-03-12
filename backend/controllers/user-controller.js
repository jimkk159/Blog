import factory from "./handle-factory.js";
import { createOneUser } from "../module/mysql/user-model.js";
import { id_, user_ } from "../utils/table.js";
import HttpError from "../utils/http-error.js";

//Create Local User
export const createLocalUser =
  (roles) => async (name, email, avatar, password, role) => {
    if (role && ![...roles].includes(role))
      throw new HttpError(
        "Create User fail, please check your input role.",
        500
      );

    //Create User
    const newUser = await createOneUser({
      name,
      email,
      avatar,
      provider: "local",
      password,
      role,
    });

    if (!newUser)
      throw new HttpError("Create User fail, please try again later.", 500);

    return { ...newUser };
  };

const getAllUsers = factory.getAll(user_, [id_, "item", "price", "update"]);
const postUser = factory.createOne(user_);
const patchUser = factory.updateOne(user_);
const deleteUser = factory.deleteOne(user_);

export default {
  getAllUsers,
  createLocalUser,
  postUser,
  patchUser,
  deleteUser,
};
