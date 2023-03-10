import express from "express";
import factory from "../controllers/handle-factory.js";
import shareController from "../controllers/share-controller.js";

const table = "user";
const router = express.Router();
router.get("/", factory.getAll(table), shareController.responseHttp);
router.get("/:id", factory.getOne(table), shareController.responseHttp);

export default router;
