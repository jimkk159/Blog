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
  access_token_,
} from "../utils/table.js";
import userController from "./user-controller.js";
import shareController from "./share-controller.js";

//Confirm Password
export const confirmPasswordConsistency = (password, confirmPassword) => {
  if ("" + password !== "" + confirmPassword)
    return new HttpError("Password and confirm password are not match.", 400);
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
    valid = await bcrypt.compare(password, comparePassword);
  } catch (err) {
    return new HttpError("Valid credentials fail", 500);
  }
  return !valid && new HttpError("Invalid credentials.", 401);
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
export const createTokenCookie = (req, res) => {
  const token = res.locals.token;
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

//-----------------Get---------------------
//Identify User
export const identifyUser = catchAsync(async (req, res, next) => {
  const user = await queryPool.getOne(user_, id_, req.user.id);
  if (!user)
    throw new HttpError("User not exists, singup an account first.", 422);
  req.user = { ...req.user, ...user };
  next();
});

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

//Get User Secrect
export const getUserSecrect = (provider) => async (req, res, next) => {
  const result = await queryPool.getOneMulti(
    auth_,
    [provider_, user_id_],
    [provider, req.user.id]
  );
  if (!result)
    throw new HttpError("No such user, Please check your input.", 500);
  return { ...req.user, password: result.password };
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
    res.locals.token = generateToken(req.user.id, req.user.email);

    // 7) create token cookie
    createTokenCookie(req, res);

    const token = res.locals.token;
    if (res.locals.token) delete res.locals.token;
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
  req.user = secrectFunc(req, res, next);

  // 3) Check password
  await checkPassword(req.body.password, req.user.password);

  // 4) Generate token
  res.locals.token = generateToken(req.user.id, req.user.email);

  // 5) create token cookie
  createTokenCookie(req, res);

  const token = res.locals.token;
  if (res.locals.token) delete res.locals.token;
  if (req.user.password) delete req.user.password;
  if (req.body.password) delete req.body.password;

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
          emailFunc(element.email);
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
  // 1) Get user based on POSTed email
  const user = await queryPool.getOne(user_, email_, req.body.email);
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
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
};
