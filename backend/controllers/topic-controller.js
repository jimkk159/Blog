import HttpError from "../utils/http-error.js";
import queryPool from "../module/mysql/pool.js";
import catchAsync from "../utils/catch-async.js";
import apiFeatures from "../utils/api-features.js";
import topicModule from "../module/mysql/topic-model.js";
import {
  topic_,
  parent_,
  id_,
  topic_name_,
  parent_id_,
  cover_,
} from "../utils/table.js";

const child = "`child`";
const children = "`children`";
const identifyTopic = catchAsync(async (req, res, next) => {
  //To Seperate the topic and parent and children
  if (!req.body.topic || req.body.topic === "null")
    return next(new HttpError("Input topic null!!", 400));

  if (req.body.topic.toLowerCase() === "root")
    return next(new HttpError("Not allow to set Root for Topic.", 422));

  next();
});

const isValidParentChildRelation = async (parent, child) => {
  const childTopic = await queryPool.getOne(topic_, topic_name_, child);
  const parentTopic = await queryPool.getOne(topic_, id_, childTopic.parent_id);
  if (parent !== parentTopic.name) return false;
  return true;
};

const isValidTopic = async (req, res, next) => {
  //Check Existed Topic
  const topic = await queryPool.getOne(topic_, topic_name_, req.body.topic);
  const parent = await queryPool.getOne(topic_, topic_name_, req.body.parent);
  let children = [];
  if (Array.isArray(req.body.children)) {
    children = [
      ...new Set(req.body.children.map((element) => element.toLowerCase())),
    ];
  } else if (req.body.children) {
    children = [req.body.children.toLowerCase()];
  }

  // Parent Not Exist-----------------------
  if (!parent)
    return {
      valid: false,
      status: 404,
      message: "Topic Parent not found!",
    };

  // Parent not match Parent-----------------------
  if (
    topic &&
    !(await isValidParentChildRelation(req.body.parent, req.body.topic))
  )
    return {
      valid: false,
      status: 422,
      message: "Parent does not match!",
    };

  // Children not match -----------------------
  const checkParent = topic ? req.body.topic : req.body.parent;
  if (
    !children.length &&
    !(
      await Promise.all(
        children.map((child) => isValidParentChildRelation(checkParent, child))
      )
    ).every((element) => element)
  )
    return {
      valid: false,
      status: 422,
      message: "Children does not match!",
    };

  if (topic) {
    return { valid: true, exist: true, ...topic };
  }
  // Get Children Ids
  if (children.length)
    children = (
      await queryPool.getMany(topic_, topic_name_, children, id_)
    ).map((element) => element.id);

  return {
    valid: true,
    exist: false,
    topic: req.body.topic,
    parent_id: parent.id,
    children,
  };
};

const validationTopic = catchAsync(async (req, res, next) => {
  const result = await isValidTopic(req, res, next);
  if (!result.valid) return next(new HttpError(result.message, result.status));
  delete result.valid;
  res.locals.topic = { ...result };

  next();
});

const parseTopic = catchAsync(async (req, res, next) => {
  if (
    !req.body.topic ||
    req.body.topic === "null" ||
    req.body.topic.toLowerCase() === "root"
  )
    return next();

  const result = await isValidTopic(req, res, next);
  const exist = result?.exist;
  if (!result.valid) return next(new HttpError(result.message, result.status));
  delete result.valid;
  delete result.exist;

  if (exist) {
    res.locals.topic = result;
    res.locals.response = result;
    return next();
  }

  const newTopic = await topicModule.createOneTopic({ ...result });
  res.locals.topic = newTopic;
  res.locals.response = newTopic;
  next();
});

//-----------------Get---------------------
const getOneTopic = catchAsync(async (req, res, next) => {
  //Self-join
  const features = new apiFeatures.getOneFeatures(`${topic_}`, {
    [`${topic_}.${id_}`]: req.params.id,
  })
    .join(
      "LEFT",
      `${topic_} ${child}`,
      `${topic_}.${id_} = ${child}.${parent_id_}`
    )
    .join(
      "LEFT",
      `${topic_} ${parent_}`,
      `${parent_}.${id_} = ${topic_}.${parent_id_}`
    )
    .filter()
    .group(`${topic_}.${id_}`)
    .limitFields([
      `${topic_}.${id_}`,
      `${topic_}.${topic_name_}`,
      `${topic_}.${parent_id_}`,
      `${parent_}.${topic_name_} AS ${parent_}`,
      `GROUP_CONCAT(${child}.${topic_name_} ORDER BY ${child}.${id_} SEPARATOR \',\') AS ${children}`,
      `${topic_}.${cover_}`,
    ]);
  const topic = (await queryPool.query(features.query, features.values)).map(
    (element) => {
      if (element.children) element.children = element.children.split(",");
      return element;
    }
  );

  res.status(201).json({
    status: "success",
    data: {
      topic,
    },
  });
});

const getAllTopic = catchAsync(async (req, res, next) => {
  //Self-join
  const features = new apiFeatures.getAllFeatures(`${topic_}`, req.query)
    .join(
      "LEFT",
      `${topic_} ${child}`,
      `${topic_}.${id_} = ${child}.${parent_id_}`
    )
    .join(
      "LEFT",
      `${topic_} ${parent_}`,
      `${parent_}.${id_} = ${topic_}.${parent_id_}`
    )
    .filter()
    .group(`${topic_}.${id_}`)
    .sort(`${topic_}.${id_}`)
    .limitFields([
      `${topic_}.${id_}`,
      `${topic_}.${topic_name_}`,
      `${topic_}.${parent_id_}`,
      `${parent_}.${topic_name_} AS ${parent_}`,
      `GROUP_CONCAT(${child}.${topic_name_} ORDER BY ${child}.${id_} SEPARATOR \',\') AS ${children}`,
      `${topic_}.${cover_}`,
    ]);

  const topics = (await queryPool.query(features.query, features.values)).map(
    (element) => {
      if (element.children) element.children = element.children.split(",");
      return element;
    }
  );

  res.status(201).json({
    status: "success",
    results: topics.length,
    data: {
      topics,
    },
  });
});

//-----------------Post---------------------
const createOneTopic = catchAsync(async (req, res, next) => {
  const exist = res.locals.topic?.exist;
  delete res.locals.topic?.exist;

  if (exist) {
    res.locals.response = res.locals.topic;
    return next();
  }

  const newTopic = await topicModule.createOneTopic({ ...res.locals.topic });
  res.locals.topic = newTopic;
  res.locals.response = newTopic;
  next();
});

export default {
  isValidTopic,
  identifyTopic,
  validationTopic,
  parseTopic,
  getOneTopic,
  getAllTopic,
  createOneTopic,
};
//reference:https://advancedweb.hu/how-to-use-async-functions-with-array-some-and-every-in-javascript/
