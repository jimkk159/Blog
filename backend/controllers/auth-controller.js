import jwt from "jsonwebtoken";
import HttpError from "../utils/http-error.js";
import queryPool from "../module/mysql/pool.js";
import catchAsync from "../utils/catch-async.js";
import {
  auth_,
  user_id_,
  provider_,
  password_,
  access_token_,
} from "../utils/table.js";
import userController from "./user-controller.js";
import shareController from "./share-controller.js";
import Email from "../utils/email.js";
import pool from "../module/mysql/index.js";
import queryConnection from "../module/mysql/connection.js";
import {
  identifyUser,
  identifyEmail,
  identifyAuth,
  generatePassword,
  confirmPasswordConsistency,
  encryptPassword,
  checkPassword,
  generateToken,
  createTokenCookie,
  getUserSecrect,
} from "../utils/auth-helper.js";

//Verify Json Web Token
 const authToken = (req, res, next) => {

  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; //Authorization: 'Bearer TOKEN
    if (!token) {
      throw new HttpError("Auythentication failed!", 403);
    }
    const decodeToken = jwt.verify(token, process.env.JWT_KEY);
    req.user = { id: decodeToken.uid };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed!", 403);
    return next(error);
  }
};

//----------------Post---------------------
//SignUp
const signup = (...roles) =>
  catchAsync(async (req, res, next) => {
    // 1) Confirm password consistency
    confirmPasswordConsistency(req.body.password, req.body.confirmPassword);

    // 2) Confirm email no exist
    const emailFunc = identifyEmail("empty");
    req.user = await emailFunc(req.body.email);

    // 3) Create user avatar
    res.locals.avatar = shareController.createAvatar(req.body.email, req.file);

    // 4) Encrypt password
    req.user.password = await encryptPassword(req.body.password);

    // 5) Create Local User
    const createFunc = userController.createLocalUser(roles);
    req.user = await createFunc(
      req.body.name,
      req.body.email,
      res.locals.avatar,
      req.user.password,
      req.body.role
    );

    // 6) Generate token
    const token = generateToken(req.user.id, req.user.email);

    // 7) create token cookie
    createTokenCookie(req, res, token);

    if (req.user.password) delete req.user.password;

    res.status(201).json({
      status: "success",
      message: "Signup successfully",
      data: {
        id: req.user.id,
        name: req.user.name,
        role: req.user.role,
        avatar: req.user.avatar,
        token,
      },
    });
  });

//Login
const login = catchAsync(async (req, res, next) => {
  // 1) Confirm email exist
  const emailFunc = identifyEmail("exist");
  req.user = await emailFunc(req.body.email);

  // 2) Get local user password
  const secrectFunc = getUserSecrect("local");
  const auth = await secrectFunc(req.user.id);

  // 3) Check password
  await checkPassword(req.body.password, auth.password);

  // 4) Generate token
  const token = generateToken(req.user.id, req.user.email);

  // 5) create token cookie
  createTokenCookie(req, res, token);

  res.status(200).json({
    status: "success",
    message: "Login successfully",
    data: {
      id: req.user.id,
      name: req.user.name,
      role: req.user.role,
      avatar: req.user.avatar,
      token,
    },
  });
});

//Logout
const logout = (req, res, next) => {
  res.cookie(access_token_, "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(204).json();
};

//SignUp for team
const singupTeam = (...roles) =>
  catchAsync(async (req, res, next) => {
    // 1) Confirm password consistency
    req.body.users.forEach((element) => {
      confirmPasswordConsistency(element.password, element.confirmPassword);
    });

    //Initial function by factory function
    const emailFunc = identifyEmail("empty");
    const createFunc = userController.createLocalUser(roles);

    let users = (
      await Promise.all(
        req.body.users.map(async (element) => {
          // 2) Confirm email no exist
          await emailFunc(element.email);

          // 3) Create user avatar
          const avatar = shareController.createAvatar(element.email);

          // 4) Encrypt password
          const password = await encryptPassword(element.password);

          // 5) Create Local User
          return await createFunc(
            element.name,
            element.email,
            avatar,
            password,
            element.role
          );
        })
      )
    ).map((element) => ({
      id: element.id,
      name: element.name,
      role: element.role,
      avatar: element.avatar,
    }));

    res.status(201).json({
      status: "success",
      message: "Create successfully",
      data: users,
    });
  });

const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on email
  const emailFunc = identifyEmail("exist");
  req.user = await emailFunc(req.body.email);

  // 2) Generate the new password
  const newPassword = generatePassword(12);
  const newEncryptPassword = await encryptPassword(newPassword);
  const message = `<p>Your new password is</p>` + `<h2>${newPassword}</h2>`;

  // 3) Change the user password
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await queryConnection.updateOne(
      connection,
      auth_,
      [password_],
      [user_id_, provider_],
      [newEncryptPassword, req.user.id, "local"]
    );

    // 4) Send it to user's email
    await new Email(req.user).send("Reset Password", message);
    res.status(200).json({
      status: "success",
      message:
        "Reset password successfully, New password has sent to your email!",
    });
    await connection.commit();
    connection.release();
  } catch (err) {
    console.log(err);
    await connection.rollback();
    connection.release();
    return next(
      new HttpError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

const updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user
  const user = await identifyUser(req.user.id);

  // 2) Check password
  if (!req.body.password)
    return next(new HttpError("Please provide your password", 400));

  // 3) Confirm password consistency
  confirmPasswordConsistency(req.body.password, req.body.confirmPassword);

  // 4) Check password
  await identifyAuth(user.id, "local", req.body.originPassword);

  // 5) Encrypt password
  const newEncryptPassword = await encryptPassword(req.body.password);

  // 6) Update password
  await queryPool.updateOne(
    auth_,
    [password_],
    [user_id_, provider_],
    [newEncryptPassword, user.id, "local"]
  );

  // 7) Generate token
  const token = generateToken(user.id, user.email);

  // 8) create token cookie
  createTokenCookie(req, res, token);

  res.status(201).json({
    status: "success",
    message: "Update successfully",
    data: {
      token,
    },
  });
});

export default {
  authToken,
  signup,
  singupTeam,
  login,
  logout,
  forgotPassword,
  updatePassword,
};
