import express from "express";

import userController from "../controllers/user-controller/index.js";
import shareController from "../controllers/share-controller/index.js";

const router = express.Router();
router.get(
  "/",
  userController.getUsers,
  shareController.responseHttp
);
router.get(
  "/:uid",
  userController.getUser,
  shareController.responseHttp
);

export default router;
