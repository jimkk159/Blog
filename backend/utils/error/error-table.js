import AppError from "./app-error.js";

export const wrongSearchParamsError = (err) =>
  new AppError(`Search parameter is wrong!`, 400);

export const dbUniqueConstraintError = (err) =>
  new AppError(`${err.message}`, 400);

export const dbValidateError = () =>
  new AppError(`You have an error in your SQL Model validation;`, 400);

export const dbSyntaxError = () =>
  new AppError(`You have an error in your query syntax;`, 400);

export const dbBadFieldsError = () =>
  new AppError(`You have an error in your query fields;`, 400);

export const dbBadTimeStampError = () =>
  new AppError(`You have an error in your query TimeStamp;`, 422);

export const authTokenNotExistError = () =>
  new AppError("Authentication failed!", 400);

export const isNotLegalUserError = () =>
  new AppError("Authentication failed!", 400);

export const verifyTokenFailError = () =>
  new AppError("Authentication failed!", 400);

export const generateAuthTokenError = () =>
  new AppError(
    "Something go worng when create token, please try again later.",
    500
  );

export const encryptPasswordError = () =>
  new AppError("Encrypt Password fail, please try again.", 500);

export const passwordNotMatchError = () =>
  new AppError("Password are not match.", 400);

export const wrongPasswordError = () =>
  new AppError("Wrong password, please check your password.", 401);

export const validatePasswordError = () =>
  new AppError(
    "Something wrong with password validation, please try again later.",
    500
  );

export const accountAuthNotFingError = (provider) =>
  new AppError(
    `You haven't signed up on ${provider} yet, please singn up first.`,
    404
  );

export const duplicatedSignUpError = () =>
  new AppError("You have signed up already, please login instead.", 422);

export const userNotExistError = () =>
  new AppError("User not exists, singup an account first.", 422);

export const passwordNoProvidError = () =>
  new AppError("Please provide your password", 400);

export const newPasswordNoProvidError = () =>
  new AppError("Please provide the password you want to update", 400);

export const emailNotFoundError = () => new AppError("Email not found!", 403);

export const emailNotValidatedError = () =>
  new AppError("Please verify your email first!", 422);

export const emailAlreadyExistError = () =>
  new AppError("Email existed already, please login instead.", 422);

export const sendEmailError = () =>
  new AppError("There was an error sending the email. Try again later!", 500);

export const emailTokenVerifyError = () =>
  new AppError("Verify Email fail", 400);

export const tokenExpiredError = () =>
  new AppError("Token not exist or has expired.", 401);

export const idNotFoundError = () =>
  new AppError("No data found with that ID.", 404);

export const notAllowUpdateIDError = () =>
  new AppError("No Allow to update ID.", 400);

export const notAllowUpdatePasswordError = () =>
  new AppError("This route is not for password update.", 400);

export const notAllowUpdateEmailError = () =>
  new AppError("Not allow to update email.", 400);

export const validateError = (errors) =>
  new AppError(
    `Invalid inputs, please check your input ${errors
      .map((el) => el.param)
      .join(", ")} is correct.`,
    422
  );

export const permissionDenyError = () => new AppError("Permission deny", 403);

export const categoryAlreadyExistError = () =>
  new AppError("Category already exist!", 400);

export const alreadyExistError = () =>
  new AppError("The created target already exist!", 400);

export const initialCategoryTableFailError = () =>
  new AppError("Initial Category table!", 500);

export const notNumberError = (input) =>
  new AppError(`${input} should be a Number`, 400);

export const categoryNotFound = () => new AppError("Category not found", 400);

export const postNotFound = () => new AppError("Post not found", 400);

export const parentNotFound = () =>
  new AppError("Category parent not found", 400);

export const circularReferenceHappenError = () =>
  new AppError("Circular reference happen! Not allow to update!", 400);

export const notAllowUpdateRootError = () =>
  new AppError("Not allow to update root!", 400);

export const notAllowChoiceRootError = () =>
  new AppError("Not allow to choice root!", 400);

export const notAllowDeleteRootError = () =>
  new AppError("Not allow to delete root!", 400);

export const inputInvalidError = (input) =>
  new AppError(`Invalid input at ${input}`, 400);

export const tagNotExistError = () =>
  new AppError(
    "Some of tags are not exist anymore, please check your input",
    400
  );
export const loginFailError = () =>
  new AppError("Login failed! Please try again later...", 500);

export const summaryValidateFailError = () =>
  new AppError("Summary must be limited to 500 words.", 400);
