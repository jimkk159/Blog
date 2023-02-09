import HttpError from "../../models/http-error.js";

import {
  getDBTopic,
  getDBTopics,
  createDBTopic,
  getDBTopicByName,
  getDBChildren,
} from "../database/mysql.js";

const asyncEvery = async (arr, predicate) => {
  for (let element of arr) {
    if (!(await predicate(element))) return false;
  }
  return true;
};

export const getTopicByParams = async (req, res, next) => {
  //For Debug
  console.log("Get Topic");

  let targetTopic;
  const topic = req.params.topic_id;
  if (!topic) return next(new HttpError("Null query topic!", 500));
  try {
    targetTopic = await getDBTopic(topic);
  } catch (err) {
    const error = new HttpError(
      "Fetching topic from database fail, please try again later.",
      500
    );
    return next(error);
  }

  if (!targetTopic) return next(new HttpError("Topic not find!", 404));
  res.locals.topic = targetTopic;
  res.locals.response = targetTopic;
  next();
};

export const getTopics = async (req, res, next) => {
  //For Debug
  console.log("Get Topics");
  let topics;
  try {
    topics = await getDBTopics();
  } catch (err) {
    const error = new HttpError(
      "Fetching topics from database fail, please try again later.",
      500
    );
    return next(error);
  }
  res.locals.response = topics;
  next();
};

export const checkTopic = async (req, res, next) => {
  const { topic, parent, children } = JSON.parse(req.body.topic);
  let targetTopic;
  let targetParent;
  let targetChildren;
  res.locals.exist = false;
  
  if (!topic) return next(new HttpError("Must Setting Topic for the Post!!", 422));
  if (topic.toLowerCase() === "root")
    return next(new HttpError("Not allow to set Root for Post Topic.", 422));

  //Check Existed Topic
  try {
    targetTopic = await getDBTopicByName(topic);
  } catch (err) {
    const error = new HttpError(
      "Checking Topic failed, please try again later.",
      500
    );
    return next(error);
  }

  if (targetTopic) {
    res.locals.exist = true;
    try {
      //Check Parent Match
      targetParent = await getDBTopic(targetTopic.parent_id);

      if (parent !== targetParent.name)
        return next(new HttpError("Parent does not match!", 422));

      //Check Children Match
      targetChildren = await getDBChildren(targetTopic?.id);
      targetChildren = targetChildren.map((item) => item.name.toLowerCase());

      let childrenLower;
      childrenLower = children.map((item) => item.toLowerCase());
      childrenLower = [...new Set(childrenLower)]; //Remmove duplicate items

      //Remmove children more than case
      if (targetChildren.length !== childrenLower.length)
        return next(new HttpError("Children does not match!", 422));

      //Remmove children not match case
      const result = targetChildren.every((child) =>
        childrenLower.includes(child)
      );
      if (!result) return next(new HttpError("Children does not match!", 422));
      res.locals.topic = targetTopic;
      res.locals.response = targetTopic;
    } catch (err) {
      const error = new HttpError(
        "Checking Topic failed, please try again later.",
        500
      );
      return next(error);
    }
    return next();
  }

  try {
    //Check Parent
    targetParent = await getDBTopicByName(parent);
    if (!targetParent)
      return next(new HttpError("Topic Parent not found!", 404));

    //Check Children Match
    targetChildren = await getDBChildren(targetParent.id);

    const targetChildrenLower = targetChildren.map((item) =>
      item.name.toLowerCase()
    );

    let childrenLower;
    childrenLower = children.map((item) => item.toLowerCase());
    childrenLower = [...new Set(childrenLower)]; //Remmove duplicate items

    const result = childrenLower.every((child) =>
      targetChildrenLower.includes(child)
    );
    if (!result) return next(new HttpError("Children does not match!", 422));

    //Insert the children key
    const targetChildrenId = [];
    for (let child of childrenLower) {
      for (let targetChild of targetChildren) {
        if (targetChild.name.toLowerCase() === child) {
          targetChildrenId.push(targetChild.id);
        }
      }
    }
    res.locals.topic = {
      name: topic,
      parent_id: targetParent.id,
      children: targetChildrenId,
    };
  } catch (err) {
    const error = new HttpError(
      "Checking Topic failed, please try again later.",
      500
    );
    return next(error);
  }
  next();
};

//ToDo Check root
//Warning: Does not check the topic exist or not
export const createNewTopic = async (req, res, next) => {
  //For Debug
  console.log("Create New Topic");
  const targetTopic = res.locals.topic;

  if (res.locals.exist) return next();

  let newTopic;
  try {
    newTopic = await createDBTopic({
      name: targetTopic.name,
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
