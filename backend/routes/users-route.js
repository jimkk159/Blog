import express from "express";
import { check } from "express-validator";

import fileUploadToServer from "../middleware/file-upload.js";
import {
  getUsers,
  getUserbyEmail,
  getIsEmailEmpty,
  createNewUser,
  checkUserExist,
  transformUser,
  login,
  signup,
} from "../controllers/users-controller.js";

import {
  validation,
  generateToken,
  encryptPassword,
} from "../controllers/share-controller.js";

const router = express.Router();
router.get("/", getUsers);
router.post(
  "/login",
  getUserbyEmail,
  checkUserExist,
  transformUser,
  generateToken,
  login
);
router.post(
  "/signup",
  fileUploadToServer.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  validation,
  getUserbyEmail,
  getIsEmailEmpty,
  encryptPassword,
  createNewUser,
  generateToken,
  signup
);

export default router;
