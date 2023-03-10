import express from "express";
import exampleController from "../controllers/example-controller.js";
import shareController from "../controllers/share-controller.js";

const router = express.Router();

router
  .route("/")
  .get(exampleController.getAllExamples, shareController.responseHttp)
  .post(exampleController.postExample, shareController.responseHttp);

router
  .route("/:id")
  .get(exampleController.getExample, shareController.responseHttp)
  .patch(exampleController.patchExample, shareController.responseHttp)
  .delete(exampleController.deleteExample, shareController.responseHttp);

export default router;
