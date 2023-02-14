import HttpError from "../../models/http-error.js";
import {
  getDBTopic,
  getDBTopics,
  getDBTopicByName,
  getDBChildren,
} from "../../database/mysql/topic/read.js";

export const getTopic = async (req, res, next) => {
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
  let dBTopics;
  try {
    dBTopics = await getDBTopics();
    topics = dBTopics.map((item) => ({
      ...item,
      parent: "",
      children: [],
    }));
    //Setting parent and children
    for (let i = 0; i < topics.length; i++) {
      for (let j = 0; j < topics.length; j++) {
        if (i === j) continue;
        if (topics[i].parent_id === topics[j].id) {
          topics[i].parent = topics[j].topic;
          topics[j].children.push(topics[i].topic);
        }
      }
    }
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
  //To Seperate the tiouc and parent and children
  const { topic, parent, children } = req.body;
  let targetTopic;
  let targetParent;
  let targetChildren;
  res.locals.exist = false;

  if (!topic || topic === "null")
    return next(new HttpError("Must Setting Topic for the Post!!", 422));

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

      if (parent !== targetParent.topic)
        return next(new HttpError("Parent does not match!", 422));

      //Check Children Match
      targetChildren = await getDBChildren(targetTopic?.id);
      targetChildren = targetChildren.map((item) => item.topic.toLowerCase());

      let childrenLower;
      if (!children) childrenLower = [];
      else if (Array.isArray(children)) {
        childrenLower = children.map((item) => item.toLowerCase());
        childrenLower = [...new Set(childrenLower)]; //Remmove duplicate items
      } else childrenLower = [children.toLowerCase()];

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
      item.topic.toLowerCase()
    );

    let childrenLower;
    if (!children) childrenLower = [];
    else if (Array.isArray(children)) {
      childrenLower = children.map((item) => item.toLowerCase());
      childrenLower = [...new Set(childrenLower)]; //Remmove duplicate items
    } else childrenLower = [children.toLowerCase()];

    const result = childrenLower.every((child) =>
      targetChildrenLower.includes(child)
    );
    if (!result) return next(new HttpError("Children does not match!", 422));

    //Insert the children key
    const targetChildrenId = [];
    for (let child of childrenLower) {
      for (let targetChild of targetChildren) {
        if (targetChild.topic.toLowerCase() === child) {
          targetChildrenId.push(targetChild.id);
        }
      }
    }
    res.locals.topic = {
      topic,
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
