import { DUMMY_Structure } from "./Dummy_data.js";

export const getAllTopics = async (req, res, next) => {
  //For Debug
  console.log("Get Topics");
  res.json(DUMMY_Structure);
};
