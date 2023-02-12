import HttpError from "../../models/http-error.js";
import { createDBTopic } from "../../database/mysql/topic/create.js";

//Warning: Does not check the topic exist or not
export const createNewTopic = async (req, res, next) => {
  //For Debug
  console.log("Create New Topic");
  const targetTopic = res.locals.topic;
  if (res.locals.exist) return next();

  let newTopic;
  try {
    newTopic = await createDBTopic({
      topic: targetTopic.topic,
      parent_id: targetTopic.parent_id,
      children: targetTopic.children, //Childre is an array of topic id
    });
    res.locals.topic = { ...res.locals.topic, ...newTopic };
    res.locals.response = newTopic;
  } catch (err) {
    const error = new HttpError(
      "Creating Topic failed, please try again later.",
      500
    );
    return next(error);
  }
  next();
};

//reference:https://advancedweb.hu/how-to-use-async-functions-with-array-some-and-every-in-javascript/
