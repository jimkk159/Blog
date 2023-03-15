import HttpError from "../utils/http-error.js";
import helper from "../utils/helper.js";
import { createOneUser } from "../module/mysql/user-model.js";
import catchAsync from "../utils/catch-async.js";

//----------------Get--------------------
export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

//----------------Post--------------------
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

//----------------Patch--------------------
export const updateMe = catchAsync(async (req, res, next) => {
  // 1) Not for password update purpose
  if (req.body.password || req.body.passwordConfirm) {
    return next(new HttpError("This route is not for password update.", 400));
  }

  // 2) Not allow email update purpose
  if (req.body.email) {
    return next(new HttpError("Not allow to update email.", 400));
  }

  // 3) Filtered out unwanted fields
  const filteredBody = helper.filterObj(req.body, "name");
  if (req.file) filteredBody.avatar = req.file.path;

  // 4) Setting user info
  if (!Object.keys(filteredBody).length)
    return next(new HttpError("Please provide the update information.", 400));

  // 5) Setting user info
  req.params.id = req.user.id;
  req.body = filteredBody;
  next();
});

export default {
  getMe,
  updateMe,
  createLocalUser,
};
