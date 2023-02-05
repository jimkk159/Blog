import { v4 as uuidv4 } from "uuid";
import HttpError from "../models/http-error.js";
import { DUMMY_Structure } from "./Dummy_data.js";

export const getAllTopics = async (req, res, next) => {
  //For Debug
  console.log("Get Topics");
  res.json(DUMMY_Structure);
};

const checkExistedTopic = async (req, res, next) => {
  //For Debug
  console.log("Check Topic");
  const reqTopicInfo = JSON.parse(req.body.topicInfo);
  try {
    //Target Topic
    const targetTopic = DUMMY_Structure.filter(
      (topic) => topic.topic === reqTopicInfo.topic
    );

    if (targetTopic.length !== 1) return false;
    res.locals.topic = reqTopicInfo.topic;
    return reqTopicInfo.topic;
  } catch (err) {
    const error = new HttpError("Finding target topic failed.", 500);
    return next(error);
  }
};

const checkParent = async (req, res, next) => {
  //For Debug
  console.log("Check Parent");
  const reqTopicInfo = JSON.parse(req.body.topicInfo);
  try {
    //Parent
    const targetParent = DUMMY_Structure.filter(
      (topic) => topic.topic === reqTopicInfo.parent
    );
    if (targetParent.length !== 1) return false;
    res.locals.parent = reqTopicInfo.parent;
    return reqTopicInfo.parent;
  } catch (err) {
    console.log(err);
    const error = new HttpError("Finding target topic failed.", 500);
    return next(error);
  }
};

const checkParentMatch = async (req, res, next) => {
  //For Debug
  console.log("Check Parent Match");
  const targetTopic = res.locals.topic;
  if (!targetTopic)
    return next(new HttpError("Finding target topic failed.", 500));

  const reqTopicInfo = JSON.parse(req.body.topicInfo);
  try {
    //Parent
    const findingTopic = DUMMY_Structure.filter(
      (topic) => topic.topic === targetTopic
    )[0];
    const targetParent = DUMMY_Structure.filter(
      (topic) => topic.topic === reqTopicInfo.parent
    )[0];

    if (findingTopic?.parent !== targetParent?.topic) return false;
    res.locals.parent = reqTopicInfo.parent;
    return reqTopicInfo.parent;
  } catch (err) {
    const error = new HttpError("Finding target topic failed.", 500);
    return next(error);
  }
};

const checkExistedChilds = async (req, res, next) => {
  //For Debug
  console.log("Check Childs");
  const reqTopicInfo = JSON.parse(req.body.topicInfo);
  try {
    //Childs
    const targetParent = DUMMY_Structure.filter(
      (topic) => topic.topic === reqTopicInfo.parent
    )[0];
    const childsResponse = reqTopicInfo.childs.every((child) =>
      targetParent.childs.includes(child)
    );
    if (!childsResponse) return false;
    res.locals.childs = reqTopicInfo.childs;
    return reqTopicInfo.childs;
  } catch (err) {
    const error = new HttpError("Finding target topic failed.", 500);
    return next(error);
  }
};

const checkChildsMatch = async (req, res, next) => {
  //For Debug
  console.log("Check Childs Match");
  const reqTopicInfo = JSON.parse(req.body.topicInfo);
  try {
    //Childs
    const targetChilds = reqTopicInfo.childs.filter((child) => {
      const targetChild = DUMMY_Structure.filter(
        (topic) => topic.topic === child
      );
      if (targetChild.length === 1) return child;
      else return null;
    });
    if (targetChilds.length !== reqTopicInfo.childs.length) return false;
    res.locals.childs = reqTopicInfo.childs;
    return reqTopicInfo.childs;
  } catch (err) {
    const error = new HttpError("Finding target topic failed.", 500);
    return next(error);
  }
};

export const checkTargetTopic = async (req, res, next) => {
  //Check Existed Topic
  try {
    const topicResponse = await checkExistedTopic(req, res, next);

    if (topicResponse) {
      const parentResponse = await checkParentMatch(req, res, next);

      if (!parentResponse)
        return next(new HttpError("Parent doesn't not match!", 422));

      //Childs must 100% match
      const childsResponse = await checkChildsMatch(req, res, next);
      if (!childsResponse)
        return next(new HttpError("Childs does not match!", 422));
      return next();
    }
  } catch (err) {
    const error = new HttpError(
      "Checking Topic failed, please try again later.",
      500
    );
    return next(error);
  }

  try {
    const parentResponse = await checkParent(req, res, next);
    if (!parentResponse)
      return next(new HttpError("Parent topic does not exist!", 422));

    //Childs must includes
    const childsResponse = await checkExistedChilds(req, res, next);
    if (!childsResponse)
      return next(new HttpError("Childs does not match!", 422));
  } catch (err) {
    const error = new HttpError(
      "Checking Topic failed, please try again later.",
      500
    );
    return next(error);
  }
  next();
};

export const createNewTopic = async (req, res, next) => {
  //For Debug
  console.log("Create New Topic");

  const reqTopicInfo = JSON.parse(req.body.topicInfo);
  //Check Topic Exist
  let targetTopic = res.locals.topic;

  //Topic has Finded!
  if (targetTopic) return next();

  let newTopic;
  try {
    //To do deal with level
    const targetParent = DUMMY_Structure.filter(
      (topic) => topic.topic.toLowerCase() === reqTopicInfo.parent.toLowerCase()
    )[0];
    const targetChilds = DUMMY_Structure.filter((topic) => {
      const targetChild = reqTopicInfo.childs.filter(
        (child) => topic.topic.toLowerCase() === child.toLowerCase()
      );
      return targetChild.length === 1;
    });
    targetParent.childs = targetParent.childs.filter((child) => {
      return !reqTopicInfo.childs.includes(child);
    });
    targetParent.childs.push(reqTopicInfo.topic);
    targetChilds.map((child) => {
      child.parent = reqTopicInfo.topic;
      child.level++;
    });
    newTopic = {
      id: uuidv4(),
      level: targetParent.level + 1,
      topic: reqTopicInfo.topic,
      parent: reqTopicInfo.parent,
      childs: reqTopicInfo.childs,
    };
    DUMMY_Structure.push(newTopic);
  } catch (err) {
    console.log(err);
  }
  res.locals.topic = reqTopicInfo.topic;
  next();
};
