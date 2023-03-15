import jwt from "jsonwebtoken";

import Email from "../utils/email.js";
import pool from "../module/mysql/index.js";
import HttpError from "../utils/http-error.js";
import queryPool from "../module/mysql/pool.js";
import catchAsync from "../utils/catch-async.js";
import queryConnection from "../module/mysql/connection.js";

import userController from "./user-controller.js";
import shareController from "./share-controller.js";

import {
  auth_,
  user_id_,
  provider_,
  password_,
  auth_token,
  access_token_,
  valid,
  user_,
  email_,
} from "../utils/table.js";
import authHelper from "../utils/auth-helper.js";

//Verify Json Web Token
const authToken = (req, res, next) => {
  // 1) Allow preflight
  if (req.method === "OPTIONS") return next();

  // 2) Verify token
  try {
    const token = req.headers.authorization.split(" ")[1]; //Authorization: 'Bearer TOKEN
    if (!token) throw new HttpError("Auythentication failed!", 403);

    const decodeToken = jwt.verify(token, process.env.JWT_KEY);
    req.user = { id: decodeToken.uid };
    next();
  } catch (err) {
    return next(new HttpError("Authentication failed!", 403));
  }
};

//----------------Post---------------------
//SignUp
const signup = (...roles) =>
  catchAsync(async (req, res, next) => {
    // 1) Confirm password consistency
    authHelper.confirmPasswordConsistency(
      req.body.password,
      req.body.confirmPassword
    );

    // 2) Confirm email exist
    const emailFunc = authHelper.identifyEmail();
    req.user = await emailFunc(req.body.email);
    if (req.user) {
      // 3) Check if user auth again
      const secrectFunc = authHelper.getUserSecrect("local");
      const auth = await secrectFunc(req.user.id);
      if (auth.valid)
        throw HttpError("Email existed already, please login instead.", 422);
      else {
        // 4) Remove old user data
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        try {
          const user = await queryConnection.getOne(
            connection,
            user_,
            [email_],
            [req.body.email]
          );
          await queryConnection.deleteOne(
            connection,
            user_,
            [email_],
            [req.body.email]
          );
          await queryConnection.deleteOne(
            connection,
            auth_,
            [user_id_],
            [user.id]
          );
          await connection.commit();
          connection.release();
        } catch (err) {
          await connection.rollback();
          connection.release();
          return err;
        }
      }
    }

    // 5) Create user avatar
    res.locals.avatar = shareController.createAvatar(req.body.email, req.file);

    // 6) Encrypt password
    req.user.password = await authHelper.encryptPassword(req.body.password);

    // 7) Create Local User
    const createFunc = userController.createLocalUser(roles);
    req.user = await createFunc(
      req.body.name,
      req.body.email,
      res.locals.avatar,
      req.user.password,
      req.body.role
    );

    // 8) Generate token
    const token = authHelper.generateToken(req.user.id, req.user.email);

    // 9) Save token to database
    await queryPool.updateOne(
      auth_,
      [auth_token],
      [user_id_, provider_],
      [token, req.user.id, "local"]
    );

    // 10) Send it to user's email
    await new Email(req.body.email, req.body.name).sendWelcome(
      `${req.protocol}://${req.get("host")}/auth/verifyEmail/${token}`
    );

    res.status(201).json({
      status: "success",
      message: "Signup successfully! Please check your email!",
    });
  });

//Login
const login = catchAsync(async (req, res, next) => {
  // 1) Confirm email exist
  const emailFunc = authHelper.identifyEmail("exist");
  req.user = await emailFunc(req.body.email);

  // 2) Get local user password
  const secrectFunc = authHelper.getUserSecrect("local");
  const auth = await secrectFunc(req.user.id);

  // 3) Check user has email-verified
  if (!auth.valid) throw new HttpError("Please verify your email first");

  // 4) Check password
  await authHelper.checkPassword(req.body.password, auth.password);

  // 5) Generate token
  const token = authHelper.generateToken(req.user.id, req.user.email);

  // 6) create token cookie
  authHelper.createTokenCookie(req, res, token);

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
  // Remove cookie token
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
      authHelper.confirmPasswordConsistency(
        element.password,
        element.confirmPassword
      );
    });

    //Initial function by factory function
    const emailFunc = authHelper.identifyEmail("empty");
    const createFunc = userController.createLocalUser(roles);

    let users = (
      await Promise.all(
        req.body.users.map(async (element) => {
          // 2) Confirm email no exist
          await emailFunc(element.email);

          // 3) Create user avatar
          const avatar = shareController.createAvatar(element.email);

          // 4) Encrypt password
          const password = await authHelper.encryptPassword(element.password);

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
  const emailFunc = authHelper.identifyEmail("exist");
  req.user = await emailFunc(req.body.email);

  // 2) Generate the new password
  const newPassword = authHelper.generatePassword(12);
  const newEncryptPassword = await authHelper.encryptPassword(newPassword);
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
    await new Email(req.user.email, req.user.name).send(
      "Reset Password",
      message
    );
    res.status(200).json({
      status: "success",
      message:
        "Reset password successfully, New password has sent to your email!",
    });
    await connection.commit();
    connection.release();
  } catch (err) {
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
  const user = await authHelper.identifyUser(req.user.id);

  // 2) Check password
  if (!req.body.password)
    return next(new HttpError("Please provide your password", 400));

  // 3) Confirm password consistency
  authHelper.confirmPasswordConsistency(
    req.body.password,
    req.body.confirmPassword
  );

  // 4) Check password
  await authHelper.identifyAuth(user.id, "local", req.body.originPassword);

  // 5) Encrypt password
  const newEncryptPassword = await authHelper.encryptPassword(
    req.body.password
  );

  // 6) Update password
  await queryPool.updateOne(
    auth_,
    [password_],
    [user_id_, provider_],
    [newEncryptPassword, user.id, "local"]
  );

  // 7) Generate token
  const token = authHelper.generateToken(user.id, user.email);

  // 8) create token cookie
  authHelper.createTokenCookie(req, res, token);

  res.status(201).json({
    status: "success",
    message: "Update successfully",
    data: {
      token,
    },
  });
});

const verifyEmail = catchAsync(async (req, res, next) => {
  // 1) Verify token
  const decodeToken = jwt.verify(req.params.token, process.env.JWT_KEY);

  // 2) Get local authuthenation info
  const auth = await queryPool.getOne(
    auth_,
    [user_id_, provider_],
    [decodeToken.uid, "local"]
  );

  // 3) Check token
  if (auth.token !== "" + req.params.token)
    return next(new HttpError("Verify Email fail", 400));

  // 4) Update user local auth valid to true
  await queryPool.updateOne(
    auth_,
    [auth_token, valid],
    [user_id_, provider_],
    ["", true, decodeToken.uid, "local"]
  );

  res.redirect(process.env.CLIENT_URL);
});

export default {
  authToken,
  signup,
  singupTeam,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  updatePassword,
};
