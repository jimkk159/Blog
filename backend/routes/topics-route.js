import express from "express";

import {
  getTopicByParams,
  getTopics,
  checkTopic,
  createNewTopic,
} from "../controllers/api/topics-controller.js";
import { responseHttp } from "../controllers/api/share-controller.js";

const router = express.Router();

router.get("/", getTopics, responseHttp);
router.get("/:topic_id", getTopicByParams, responseHttp);
router.post("/new", checkTopic, createNewTopic, responseHttp);
// router.post("/test", checkExistedTopic);

export default router;
