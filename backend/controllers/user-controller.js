import factory from "./handle-factory.js";
import { createOneUser } from "../module/mysql/user-model.js";
import { id_, user_ } from "../utils/table.js";
import HttpError from "../utils/http-error.js";

//Create Local User
export const createLocalUser =
  (roles) => async (name, email, avatar, password, role) => {
    // 1) Check the input user role
    if (role && ![...roles].includes(role))
      throw new HttpError(
        "Create User fail, please check your input role.",
        500
      );

    // 2) Create local User
    const newUser = await createOneUser({
      name,
      email,
      avatar,
      provider: "local",
      password,
      role,
    });

    // 3) Create local User
    if (!newUser)
      throw new HttpError("Create User fail, please try again later.", 500);

    return { ...newUser };
  };

export default {
  createLocalUser,
};
