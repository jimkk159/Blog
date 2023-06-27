import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../module/user.js";
import Auth from "../../module/auth.js";
import sequelize from "../../config/db-init.js";
import * as authHelper from "./auth-helper.js";
import * as errorTable from "../error/error-table.js";

export const isHearderAuthorization = (headers) =>
  !!(headers.authorization && typeof headers.authorization === "string");

export const isLocal = (provider) => provider === "local";

export const isUserLegal = (user, provider) => {
  if (!user) return false;
  if (!isLocal(provider)) return true;
  if (user.isEmailValidated) return true;
  return false;
};
// TODO password updated at
export const isTokenLegal = async (decodeToken) => {
  const auth = await Auth.findOne({
    where: { UserId: decodeToken.uid, provider: "local" },
  });

  if (new Date(auth.updatedAt) > new Date(1000 * decodeToken.iat)) return false;
  return true;
};

// Password Random Generator
export const generateRandomPassword = (length) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+|~\\=-`[]{}\"';:?/<>,.";

  let password = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
};

// check Password Consistency
export const isPasswordConsistent = (password, confirmPassword) =>
  password === confirmPassword;

export const confirmPasswordConsistency = (password, confirmPassword) => {
  if (!isPasswordConsistent(password, confirmPassword))
    throw errorTable.passwordNotMatchError();
};

// Hash Password
const hashSalt = 12;
export const encryptPassword = async (password) =>
  bcrypt.hash("" + password, hashSalt).catch(() => {
    throw errorTable.encryptPasswordError();
  });

// Check Password
export const validatePassword = async (password, hash) => {
  let valid = false;
  try {
    valid = await bcrypt.compare("" + password, hash);
  } catch (err) {
    throw errorTable.validatePasswordError();
  }
  if (!valid) throw errorTable.wrongPasswordError();
};

// Generate random token
export const generateRandomCrypto = () =>
  crypto.randomBytes(32).toString("hex");

// Create email validation token
export const createEmailValidationToken = ({ uid, token }) =>
  jwt.sign({ uid, token }, process.env.JWT_KEY, {
    expiresIn: 15 * 60,
  });

// Generate Json Web Token
export const generateToken = (uid, email) => {
  try {
    return jwt.sign({ uid, email }, process.env.JWT_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN + "h",
    });
  } catch (err) {
    throw errorTable.generateAuthTokenError();
  }
};

// Create Json Web Token Cookie
export const createTokenCookie = (req, res, token) => {
  res.cookie("token", token, {
    expires: new Date(Date.now() + process.env.JWT_EXPIRES_IN * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });
};

// Update Email check Token to database
export const updateEmailCheckToken = async (uid, token) =>
  Auth.update({ token }, { where: { UserId: uid, provider: "local" } });

// Update User and its auth info
export const updateUserAndAuth = async (userInfo, authInfo) => {
  const updateUserInfo = { ...userInfo };
  const updateAuthInfo = { ...authInfo };
  delete updateUserInfo.id;
  delete updateAuthInfo.provider;

  await sequelize.transaction(async (t) => {
    await User.update(updateUserInfo, {
      where: { id: userInfo.id },
      transaction: t,
    });
    await Auth.update(updateAuthInfo, {
      where: { UserId: userInfo.id, provider: authInfo.provider },
      transaction: t,
    });
  });
};

// Create User and its auth info
export const createUserAndAuth = async (userInfo, authInfo) => {
  let newUser;
  await sequelize.transaction(async (t) => {
    newUser = await User.create(userInfo, { transaction: t });

    await Auth.create(
      {
        UserId: newUser.id,
        ...authInfo,
      },
      { transaction: t }
    );
  });
  return newUser;
};

//Identify Auth
export const identifyAuth = async ({ UserId, provider, password }) => {
  // Get password
  const auth = await Auth.findOne({
    where: { UserId, provider },
    raw: true,
  });
  if (!auth) throw errorTable.accountAuthNotFingError(provider);

  // Compare password
  await authHelper.validatePassword(password, auth.password);
};

export const updatePassword = async ({ UserId, provider, password }) => {
  const userInfo = { id: UserId, updatePasswordAt: Date.now() };
  const authInfo = { password, provider };

  await authHelper.updateUserAndAuth(userInfo, authInfo);
};

export const isSameToken = (token1, token2) => "" + token1 === "" + token2;

export const checkEmailValidationToken = async ({
  UserId,
  token,
  provider,
}) => {
  const auth = await Auth.findOne({
    where: { UserId, provider },
  });

  if (auth && !isSameToken(auth.token, token))
    throw errorTable.emailTokenVerifyError();
};
