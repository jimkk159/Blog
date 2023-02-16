import express from "express";
import { check } from "express-validator";

import { getPostSearch } from "../controllers/search-controller/index.js";
import {
  validation,
  responseHttp,
} from "../controllers/share-controller/index.js";

const router = express.Router();

router.get(
  "/",
  [check("search").not().isEmpty()],
  validation,
  getPostSearch,
  responseHttp
);

export default router;
