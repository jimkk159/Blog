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
  getUserPrefer,
  login,
  signup,
} from "../controllers/user-controller/index.js";

import {
  validation,
  generateToken,
  encryptPassword,
  createAvatar,
  responseHttp,
} from "../controllers/share-controller/index.js";

const router = express.Router();
router.get("/", getUsers, responseHttp);
router.get("/:uid", getUserbyParams, responseHttp);
router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  validation,
  getUserbyEmail,
  getIsEmail,
  getUserPrefer,
  generateToken,
  login,
  responseHttp
);
router.post(
  "/signup",
  fileUploadToServer.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
    check("theme").not().isEmpty(),
    check("language").not().isEmpty(),
  ],
  validation,
  getUserbyEmail,
  getIsEmailEmpty,
  encryptPassword,
  createAvatar,
  createNewUser,
  generateToken,
  signup,
  responseHttp
);

export default router;
