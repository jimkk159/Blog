import catchAsync from "../utils/catch-async.js";
import * as errorTable from "../utils/error/error-table.js";

export const setHasValidate = catchAsync((req, res, next) => {
  req.body = { ...req.body, isEmailValidated: true };
  next();
});

//----------------Get--------------------
export const getMe = catchAsync((req, res, next) => {
  req.params.id = req.user.id;
  next();
});

//----------------Patch--------------------
export const isUpdatePassword = (input) =>
  !!(input.password || input.passwordConfirm);

export const updateMe = catchAsync(async (req, res, next) => {
  // 1) Not for password update purpose
  if (isUpdatePassword(req.body)) {
    throw errorTable.notAllowUpdatePasswordError();
  }

  // 2) Not allow email update purpose
  if (req.body.email) {
    throw errorTable.notAllowUpdateEmailError();
  }

  // 3) add avatar to update list
  if (req.file) req.body.avatar = req.file.path;

  // 4) Setting user info
  req.params.id = req.user.id;
  next();
});
