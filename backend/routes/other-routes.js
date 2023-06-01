import express from "express";
import About from "../module/about.js";
import * as factory from "../controllers/handle-factory.js";
import * as upload from "../utils/file-upload.js"
import * as authController from "../controllers/auth-controller.js"
import * as shareController from "../controllers/share-controller.js"

const router = express.Router();

router.get("/about", factory.getOne(About));

router.use(authController.authUserByToken);

router.post(
    "/img",
    upload.uploadToMemory.single("img"),
    shareController.updateImage
  );
  

export default router;
