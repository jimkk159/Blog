import express from "express";

import {
  getTopic,
  getTopics,
  checkTopic,
  createNewTopic,
} from "../controllers/topic-controller/index.js";
import { responseHttp } from "../controllers/share-controller/index.js";

const router = express.Router();

router.get("/", getTopics, responseHttp);
router.get("/:topic_id", getTopic, responseHttp);
router.post("/new", checkTopic, createNewTopic, responseHttp);
// router.post("/test", checkExistedTopic);

export default router;