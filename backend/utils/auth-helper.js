import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import queryPool from "../module/mysql/pool.js";
import {
  id_,
  user_,
  email_,
  auth_,
  user_id_,
  provider_,
  access_token_,
} from "./table.js";

//Password Generator
const generatePassword = (length) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+|~\\=-`[]{}\"';:?/<>,.";

  let password = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
};

//Confirm Password
const confirmPasswordConsistency = (password, confirmPassword) => {
  if ("" + password !== "" + confirmPassword)
    throw new HttpError("Password are not match.", 400);
};

//Hash Password
const encryptPassword = async (password) => {
  try {
    return await bcrypt.hash("" + password, 12);
  } catch (err) {
    throw new HttpError("Encrypt fail, please try again.", 500);
  }
};

//Check Password
const checkPassword = async (password, comparePassword) => {
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
const generateToken = (uid, email) => {
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
const createTokenCookie = (req, res, token) => {
  res.cookie(access_token_.replace(/(\`+|\`+)/g, ""), token, {
    expires: new Date(Date.now() + process.env.JWT_EXPIRES_IN * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });
};

//Get User Secrect
const getUserSecrect = (provider) => async (uid) => {
  const result = await queryPool.getOne(
    auth_,
    [provider_, user_id_],
    [provider, uid]
  );
  if (!result)
    throw new HttpError("No such user, Please check your input.", 404);
  return result;
};

//Identify User
const identifyUser = async (uid) => {
  const user = await queryPool.getOne(user_, [id_], [uid]);
  if (!user)
    throw new HttpError("User not exists, singup an account first.", 422);
  return user;
};

//Identify Email
const identifyEmail = (condition) => async (email) => {
  const user = await queryPool.getOne(user_, [email_], [email]);

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

export default {
  generatePassword,
  confirmPasswordConsistency,
  encryptPassword,
  checkPassword,
  generateToken,
  createTokenCookie,
  getUserSecrect,
  identifyUser,
  identifyEmail,
  identifyAuth,
};
