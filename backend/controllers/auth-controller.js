import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import HttpError from "../utils/http-error.js";
import queryPool from "../module/mysql/pool.js";
import catchAsync from "../utils/catch-async.js";
import {
  id_,
  user_,
  email_,
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

//Password Generator
function generatePassword(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+|~\\=-`[]{}\"';:?/<>,.";

  let password = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
}

//Confirm Password
export const confirmPasswordConsistency = (password, confirmPassword) => {
  if ("" + password !== "" + confirmPassword)
    throw new HttpError("Password are not match.", 400);
};

//Hash Password
export const encryptPassword = async (password) => {
  try {
    return await bcrypt.hash("" + password, 12);
  } catch (err) {
    throw new HttpError("Encrypt fail, please try again.", 500);
  }
};

//Check Password
export const checkPassword = async (password, comparePassword) => {
  //Check Password Valid
  let valid = false;
  try {
    valid = await bcrypt.compare("" + password, comparePassword);
  } catch (err) {
    throw new HttpError("Valid credentials fail", 500);
  }

  if (!valid) throw new HttpError("Invalid credentials.", 401);
};

//Generate Json Web Token
export const generateToken = (uid, email) => {
  //Create Token
  try {
    return jwt.sign({ uid, email }, process.env.JWT_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN + "h",
    });
  } catch (err) {
    throw new HttpError("Create Token fail, please try again later.", 500);
  }
};

//Create Json Web Token Cookie
export const createTokenCookie = (req, res, token) => {
  res.cookie(access_token_.replace(/(\`+|\`+)/g, ""), token, {
    expires: new Date(Date.now() + process.env.JWT_EXPIRES_IN * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });
};

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

//Get User Secrect
export const getUserSecrect = (provider) => async (uid) => {
  const result = await queryPool.getOneMulti(
    auth_,
    [provider_, user_id_],
    [provider, uid]
  );
  if (!result)
    throw new HttpError("No such user, Please check your input.", 404);
  return result;
};

//-----------------Get---------------------
//Identify User
export const identifyUser = async (uid) => {
  const user = await queryPool.getOne(user_, id_, uid);
  if (!user)
    throw new HttpError("User not exists, singup an account first.", 422);
  return user;
};

//Identify Email
export const identifyEmail = (condition) => async (email) => {
  const user = await queryPool.getOne(user_, email_, email);

  //Check User if exist
  if (condition === "exist" && !user) {
    throw new HttpError("Email not found!", 403);
  } else if (condition === "empty" && !!user) {
    throw new HttpError("Email existed already, please login instead.", 422);
  }
  return { ...user };
};

//Identify Auth
const identifyAuth = async (uid, provider, password) => {
  // Get password
  const secrectFunc = getUserSecrect(provider);
  const auth = await secrectFunc(uid);

  // Compare password
  await checkPassword(password, auth.password);

  if (!auth.expire_in) return;

  // Check Expire in
  if (new Date(auth.expire_in) > new Date())
    throw new HttpError("Token has expired.", 401);
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
  confirmPasswordConsistency,
  encryptPassword,
  checkPassword,
  authToken,
  generateToken,
  createTokenCookie,
  identifyUser,
  identifyEmail,
  getUserSecrect,
  signup,
  singupTeam,
  login,
  logout,
  forgotPassword,
  updatePassword,
};
