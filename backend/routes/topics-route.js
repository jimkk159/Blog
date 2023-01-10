import express from "express";

import {
  getAllTopics,
} from "../controllers/topics-controller.js";

const router = express.Router();

router.get("/", getAllTopics);

export default router;
