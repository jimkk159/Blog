import express from "express";
import About from "../module/about.js";
import Author from "../module/author.js";
import * as factory from "../controllers/handle-factory.js";

const router = express.Router();

router.get("about", factory.getOne(About));

router
  .route("author")
  .get(factory.getOne(Author))
  .post(factory.createOne(Author));

router.route("search", () => {});

export default router;
