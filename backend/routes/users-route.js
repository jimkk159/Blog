import express from "express";
import { check } from "express-validator";

import fileUploadToServer from "../middleware/file-upload.js";
import { getUsers, login, signup } from "../controllers/users-controller.js";

const router = express.Router();
router.get("/", getUsers);
router.post("/login", login);
router.post(
  "/signup",
  fileUploadToServer.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  signup
);

export default router;
