import express from "express";
import { check } from "express-validator";
import topicController from "../controllers/topic-controller.js";
import shareController from "../controllers/share-controller.js";
import authController from "../controllers/auth-controller.js";

const router = express.Router();

router.get("/", topicController.getAllTopic);
router.get("/:id", topicController.getOneTopic);

// check token middleware
router.use(authController.authToken);

router.post(
  "/",
  [check("topic").not().isEmpty(), check("parent").not().isEmpty()],
  shareController.validation,
  topicController.createOneTopic
);
export default router;
