import express from "express";

import topicController from "../controllers/topic-controller/index.js";
import shareController from "../controllers/share-controller/index.js";

const router = express.Router();

router.get("/", topicController.getTopics, shareController.responseHttp);
router.get(
  "/:topic_id",
  topicController.getTopic,
  shareController.responseHttp
);
router.post(
  "/new",
  topicController.checkTopic,
  topicController.createNewTopic,
  shareController.responseHttp
);
// router.post("/test", checkExistedTopic);

export default router;
