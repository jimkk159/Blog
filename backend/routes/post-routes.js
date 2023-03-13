import express from "express";
import { check } from "express-validator";

import fileUploadToServer from "../utils/file-upload.js";

import postController from "../controllers/post-controller.js";
import shareController from "../controllers/share-controller.js";
import authController from "../controllers/auth-controller.js";

const router = express.Router();

router.get(
  "/search",
  [check("search").not().isEmpty()],
  shareController.validation,
  postController.getPostSearch
);
router.get("/", postController.getAllPost);
router.get("/:ids",postController.getOnePost);

// check token middleware
router.use(authController.authToken);

router.post(
  "/",
  fileUploadToServer.fields([
    { name: "cover", maxCount: 1 },
    { name: "images" },
  ]),
  [check("detail").not().isEmpty()],
  shareController.validation,
  postController.createOnePost,
  postController.getOnePost
);

router.patch(
  "/pin/:id",
  [check("pin").not().isEmpty()],
  shareController.validation,
  // shareController.restrictTo("root", "leader", "manager"),
  postController.pinPost
);

router
  .route("/:id")
  .put(
    fileUploadToServer.fields([
      { name: "cover", maxCount: 1 },
      { name: "images" },
    ]),
    shareController.validation,
    postController.updateOnePost,
    postController.getOnePost
  )
  .delete(
    postController.deleteOnePost,
  );

export default router;
