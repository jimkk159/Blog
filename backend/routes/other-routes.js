import express from "express";
import About from "../module/about.js";
import * as factory from "../controllers/handle-factory.js";

const router = express.Router();

router.get("about", factory.getOne(About));


export default router;
