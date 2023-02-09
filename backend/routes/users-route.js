import express from "express";
import { check } from "express-validator";

import fileUploadToServer from "../middleware/file-upload.js";
import {
  getUsers,
  getUserbyEmail,
  getUserbyParams,
  getIsEmailEmpty,
  createNewUser,
  getIsEmail,
  login,
  signup,
} from "../controllers/api/users-controller.js";

import {
  validation,
  generateToken,
  encryptPassword,
  createAvatar
} from "../controllers/api/share-controller.js";

const router = express.Router();
router.get("/", getUsers);
router.get("/:uid", getUserbyParams);
router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  validation,
  getUserbyEmail,
  getIsEmail,
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
  createAvatar,
  createNewUser,
  generateToken,
  signup
);

export default router;
