import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import { Dummy_users } from "./Dummy_data.js";
import HttpError from "../models/http-error.js";

let dummy_users = Dummy_users;
export const getUsers = async (req, res, next) => {
  let users;
  try {
    users = dummy_users;
  } catch (err) {
    const error = new HttpError(
      "Fetching users from database fail, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    users: users.map((user) => user),
  });
};

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  //Check User if exist
  let existingUser;
  try {
    existingUser = dummy_users.filter((user) => email === user.email)[0];
  } catch (err) {
    const error = new HttpError("Sing up failed, please try again later.", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  //Hash Password
  let hashedPassword;
  try {
    console.log(password);
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Encrypt fail, please try again.", 500);
    return next(error);
  }

  //Create User
  let newUser;
  try {
    newUser = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
    };
    dummy_users.push(newUser);
  } catch (err) {
    const error = new HttpError(
      "Create User to database fail, please try again later.",
      500
    );
    return next(error);
  }

  //Create Token
  let token;
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Create Token fail, please try again later.",
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ userId: newUser.id, email: newUser.email, token: token });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  //Check User if exist
  let existingUser;
  try {
    existingUser = dummy_users.filter((user) => email === user.email)[0];
  } catch (err) {
    const error = new HttpError(
      "Loggin up failed, please try again later.",
      500
    );
    return next(error);
  }

  //Check if the User Exist
  if (!existingUser) {
    const error = new HttpError("User not found!", 403);
    return next(error);
  }

  //Check Password Valid
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError("Valid credentials fail", 500);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("Invalid credentials.", 401);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Logging in failed, please try later.", 500);
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};
