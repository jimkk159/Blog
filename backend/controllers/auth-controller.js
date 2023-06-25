import jwt from "jsonwebtoken";

import User from "../module/user.js";
import Auth from "../module/auth.js";
import Email from "../utils/email.js";
import * as helper from "../utils/helper/helper.js";
import catchAsync from "../utils/error/catch-async.js";
import * as errorTable from "../utils/error/error-table.js";
import * as authHelper from "../utils/helper/auth-helper.js";
import * as shareController from "./share-controller.js";

// Verify Json Web Token
export const authUserByToken = catchAsync(async (req, res, next) => {
  // 1) Allow preflight
  if (req.method === "OPTIONS") return next();

  // 2) Verify token:'Bearer TOKEN'
  if (!authHelper.isHearderAuthorization(req.headers))
    throw errorTable.authTokenNotExistError();
  const token = req.headers.authorization.split(" ")[1];
  if (!token) throw errorTable.authTokenNotExistError();

  let decodeToken;
  try {
    decodeToken = jwt.verify(token, process.env.JWT_KEY);
    req.user = { id: decodeToken.uid };
  } catch (err) {
    throw errorTable.verifyTokenFailError();
  }

  // 3) Check if user still exists
  const user = await User.findByPk(decodeToken.uid, {
    attributes: { include: ["role", "isEmailValidated"] },
  });
  if (!user) throw errorTable.userNotExistError();

  // 4) Check user legality
  if (!authHelper.isUserLegal(user, decodeToken.provider))
    throw errorTable.isNotLegalUserError();

  // 5) Check token legality
  const result = await authHelper.isTokenLegal(decodeToken);
  if (!result) throw errorTable.verifyTokenFailError();

  // 6) Set user
  req.user = user;
  next();
});

// Restrict Role
export const isIncludeRole = (role, roles) => roles.includes(role);

export const restrictTo = (...roles) =>
  catchAsync((req, res, next) => {
    if (!isIncludeRole(req.user.role, roles))
      throw errorTable.permissionDenyError();
    next();
  });

// SignUp
export const signup = catchAsync(async (req, res, next) => {
  let user, userJSON, loaclAuth;

  // 1) Confirm password consistency
  authHelper.confirmPasswordConsistency(
    req.body.password,
    req.body.confirmPassword
  );

  // 2) Check user is existed by email
  user = await User.findOne({
    where: { email: req.body.email },
    attributes: { include: ["isEmailValidated"] },
  });
  if (user) {
    loaclAuth = await user.getAuths({ where: { provider: "local" } });
    userJSON = user.toJSON();
  }

  // 3) Check if user sign up again or not exist
  if (authHelper.isUserLegal(userJSON, "local"))
    throw errorTable.emailAlreadyExistError();

  // 4) Create user avatar
  const avatar = shareController.createAvatar(req.body.email, req.file);

  // 5) Encrypt password
  const password = await authHelper.encryptPassword(req.body.password);

  // 6) Create User if not exist, update user if email is not validated
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    avatar,
    role: "user",
  };

  const auth = { password, provider: "local" };
  if (!user) userJSON = await authHelper.createUserAndAuth(newUser, auth);
  else if (!loaclAuth.length) await user.createAuth(auth);
  else
    await authHelper.updateUserAndAuth({ id: userJSON.id, ...newUser }, auth);

  // 7) Generate token and update token
  const token = authHelper.generateRandomCrypto(userJSON.id, "local");
  const verifyToken = authHelper.createEmailValidationToken({
    uid: userJSON.id,
    token,
  });

  await authHelper.updateEmailCheckToken(userJSON.id, verifyToken);

  // 8) Send it to user's email
  const host = `${req.protocol}://${req.get("host")}/api/v1`;

  const email = new Email(req.body.email, req.body.name);
  await email.sendWelcome(host, verifyToken).catch((err) => {
    throw errorTable.sendEmailError();
  });

  res.status(201).json({
    status: "success",
    message: "Signup successfully! Please check your email!",
  });
});

// Login
export const login = catchAsync(async (req, res, next) => {
  const provider = "local";
  // 1) Confirm email exist

  const user = await User.findOne({
    where: { email: req.body.email },
    raw: true,
    attributes: { include: ["role", "isEmailValidated"] },
  });
  if (!user) throw errorTable.emailNotFoundError();

  // 2) Get local user password
  const auth = await Auth.findOne({
    where: { provider, UserId: user.id },
    raw: true,
  });
  if (!auth) throw errorTable.accountAuthNotFingError(provider);

  // 3) Check user has email-verified
  if (!user.isEmailValidated) throw errorTable.emailNotValidatedError();

  // 4) Check password
  await authHelper.validatePassword(req.body.password, auth.password);

  // 5) Generate token
  const token = authHelper.generateToken(user.id, user.email);

  // 6) create token cookie
  authHelper.createTokenCookie(req, res, token);

  // 7) get Avatar
  if (user && user.avatar) user.avatar = helper.avatarToS3URL(user.avatar);
  
  res.status(200).json({
    status: "success",
    message: "Login successfully",
    token,
    data: {
      id: user.id,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    },
  });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({
    where: { email: req.body.email },
    attributes: { include: ["email"] },
    raw: true,
  });
  if (!user) throw errorTable.emailNotFoundError();

  // 2) Generate the new password
  const newPassword = authHelper.generateRandomPassword(12);
  const newEncryptPassword = await authHelper.encryptPassword(newPassword);
  const message = `<p>Your new password is</p>` + `<h2>${newPassword}</h2>`;

  // 3) Update the user password
  const updateUser = { id: user.id, isEmailValidated: true };
  const updateAuth = { password: newEncryptPassword, provider: "local" };
  await authHelper.updateUserAndAuth(updateUser, updateAuth);

  // 4) Send email
  const email = new Email(user.email, user.name);
  await email.send("Reset Password", message).catch((err) => {
    throw errorTable.sendEmailError();
  });

  res.status(200).json({
    status: "success",
    message:
      "Reset password successfully, New password has sent to your email!",
  });
});

export const updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user
  const user = await User.findOne({
    where: { id: req.user.id },
    raw: true,
  });
  if (!user) throw errorTable.userNotExistError();

  // 2) Confirm password consistency
  authHelper.confirmPasswordConsistency(
    req.body.newPassword,
    req.body.confirmNewPassword
  );

  // 3) Check password
  await authHelper.identifyAuth({
    UserId: user.id,
    provider: "local",
    password: req.body.password,
  });

  // 4) Encrypt password
  const newEncryptPassword = await authHelper.encryptPassword(
    req.body.newPassword
  );

  // 5) Update password
  await authHelper.updatePassword({
    UserId: user.id,
    provider: "local",
    password: newEncryptPassword,
  });

  res.status(201).json({
    status: "success",
    message: "Update password successfully",
  });
});

export const verifyEmail = catchAsync(async (req, res, next) => {
  // 1) Verify token
  const decodeToken = jwt.verify(req.params.emailToken, process.env.JWT_KEY);

  // 2) Check Email validation token
  await authHelper.checkEmailValidationToken({
    UserId: decodeToken.uid,
    token: req.params.emailToken,
    provider: "local",
  });

  // 3) Update user email validate to true and clean the token
  const updateUser = { id: decodeToken.uid, isEmailValidated: true };
  const updateAuth = { token: "", provider: "local" };
  await authHelper.updateUserAndAuth(updateUser, updateAuth);

  res.status(200).json({
    status: "success",
    message: "Verify email successfully",
  });
});
