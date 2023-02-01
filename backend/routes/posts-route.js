import express from "express";
import { check } from "express-validator";

import checkAuth from "../middleware/check-auth.js";
import fileUploadToServer from "../middleware/file-upload.js";

import {
  getPost,
  getPosts,
  getPostSearch,
  createNewPost,
  editPost,
  pinPost,
  deletePost,
} from "../controllers/posts-controller.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/search", getPostSearch);
router.get("/:pid", getPost);

// check token middleware
router.use(checkAuth);

router.post(
  "/new",
  fileUploadToServer.fields([
    { name: "cover", maxCount: 1 },
    { name: "images" },
  ]),
  [check("contentState").not().isEmpty()],
  createNewPost
);

router.put(
  "/:pid",
  fileUploadToServer.array("images"),
  [check("contentState").not().isEmpty()],
  editPost
);

router.patch("/:pid/pin", pinPost);

router.delete("/:pid", deletePost);

export default router;
