import dotenv from "dotenv";
dotenv.config();

/**
 * @swagger
 * components:
 *  schemas:
 *    Auth:
 *      type: object
 *      required:
 *        - name
 *        - email
 *        - password
 *      properties:
 *        id:
 *          type: INT
 *          description: The increment id of the user
 *        name:
 *          type: VARCHAR(50)
 *          description: The name of the user
 *        email:
 *          type: VARCHAR(255)
 *          description: user email
 *        password:
 *          type: VARCHAR(255)
 *          description: user password
 *        createdAt:
 *          type: DATETIME
 *          description: auth creation time
 *        updatedAt:
 *          type: DATETIME
 *          description: auth update time
 */

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: The authentication managing API
 */

/**
 * @swagger
 * /auth/signup:
 *    post:
 *        summary: Sign up your account
 *        tags: [Auth]
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                example:
 *                   name: Tom
 *                   email: test@test.com
 *                   password: 123456
 *                   confirmPassword: 123456
 *        responses:
 *          201:
 *            description: Signup successfully, go check your mail
 *          400:
 *            description: Password and confirmPassword are not equal or missing some fields needed
 *          422:
 *            description: Email already signup
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /auth/login:
 *    post:
 *        summary: Login your account
 *        tags: [Auth]
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                example:
 *                   email: test@test.com
 *                   password: 123456
 *        responses:
 *          200:
 *            description: Login successfully
 *          400:
 *            description: Missing some fields
 *          403:
 *            description: Email does not exist or password is worng
 *          404:
 *            description: You haven't sign up by email and password yet!
 *          422:
 *            description: You haven't validated you email yet! If the email is expired, you need to sign up again.
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /auth/forgotPassword:
 *    patch:
 *        summary: Update password and send a new password to email
 *        tags: [Auth]
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                example:
 *                   email: test@test.com
 *        responses:
 *          200:
 *            description: Password updated successfully. Please go check your email.
 *          400:
 *            description: Missing some fields
 *          403:
 *            description: Email does not exist
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /auth/updatePassword:
 *    patch:
 *        summary: Update our password
 *        tags: [Auth]
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                example:
 *                   password: 123456
 *                   newPassword: 123456
 *                   confirmNewPassword: 123456
 *        responses:
 *          201:
 *            description: Password updated successfully.
 *          400:
 *            description: Missing some fields or newPassword and confirmNewPassword are not equal or missing some fields needed
 *          401:
 *            description: Unauthorized
 *          404:
 *            description: You haven't sign up by email and password yet! or User does not exist
 *          500:
 *            description: Unknow error happen
 */

