import express from "express";
import { check } from "express-validator";
import authToken from "../utils/check-auth.js";
import topicController from "../controllers/topic-controller.js";
import shareController from "../controllers/share-controller.js";

const router = express.Router();

router.get("/", topicController.getAllTopic);
router.get("/:id", topicController.getOneTopic);

// check token middleware
router.use(authToken);

router.post(
  "/",
  [check("topic").not().isEmpty(), check("parent").not().isEmpty()],
  shareController.validation,
  topicController.identifyTopic,
  topicController.validationTopic,
  topicController.createOneTopic,
  shareController.responseHttp
);
export default router;
