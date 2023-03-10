import factory from "./handle-factory.js";

const table = "test";
const getExample = factory.getOne(table);
const getAllExamples = factory.getAll(table, ["id", "item", "price", "update"]);
const postExample = factory.createOne(table);
const patchExample = factory.updateOne(table);
const deleteExample = factory.deleteOne(table);

export default {
  getExample,
  getAllExamples,
  postExample,
  patchExample,
  deleteExample,
};
