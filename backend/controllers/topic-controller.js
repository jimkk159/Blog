import HttpError from "../utils/http-error.js";
import queryPool from "../module/mysql/pool.js";
import catchAsync from "../utils/catch-async.js";
import apiFeatures from "../utils/api-features.js";
import topicModel from "../module/mysql/topic-model.js";
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

const checkTopic = (topic) => {
  if (topic.toLowerCase() === "root")
    throw new HttpError("Not allow to set Root for Topic.", 422);

  if (!topic) throw new HttpError("Topic is null!", 403);
};

const isValidParentChildRelation = async (parent, child) => {
  const childTopic = await queryPool.getOne(topic_, topic_name_, child);
  if (!childTopic) return false;
  const parentTopic = await queryPool.getOne(topic_, id_, childTopic.parent_id);
  if (!parentTopic) return false;
  if (parent !== parentTopic.name) return false;
  return true;
};

const isLegalTopic = async (queryTopic, queryParent, queryChildren) => {
  //Check Topic Property
  const topic = await queryPool.getOne(topic_, topic_name_, queryTopic);
  const parent = await queryPool.getOne(topic_, topic_name_, queryParent);
  let children = [];
  if (Array.isArray(queryChildren)) {
    children = [
      ...new Set(queryChildren.map((element) => element.toLowerCase())),
    ];
  } else if (queryChildren) {
    children = [queryChildren.toLowerCase()];
  }

  // Parent Not Exist-----------------------
  if (!parent)
    return {
      valid: false,
      status: 404,
      message: "Topic Parent not found!",
    };

  // Parent not match Parent-----------------------
  if (topic && !(await isValidParentChildRelation(queryParent, queryTopic)))
    return {
      valid: false,
      status: 422,
      message: "Parent does not match!",
    };
  // Children not match -----------------------
  const checkParent = topic ? queryTopic : queryParent;
  if (
    children.length &&
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
    return { valid: true, exist: true, ...topic, children };
  }

  // Get Children Ids
  if (children.length)
    children = (
      await queryPool.getMany(topic_, topic_name_, queryChildren, id_)
    ).map((element) => element.id);

  return {
    valid: true,
    exist: false,
    topic: queryTopic,
    parent_id: parent.id,
    children,
  };
};

const identifyTopic = async (topic, parent, children) => {
  checkTopic(topic);
  const result = await isLegalTopic(topic, parent, children);
  if (!result.valid) throw new HttpError(result.message, result.status);
  return { ...result };
};

const parseTopic = async (topic, parent, children) => {
  if (
    !topic ||
    topic === "" ||
    topic === "null" ||
    topic.toLowerCase() === "root"
  )
    throw new HttpError("Invalid Topic.", 422);

  let newTopic = await isLegalTopic(topic, parent, children);

  if (!newTopic.valid) throw new HttpError(newTopic.message, newTopic.status);

  if (!newTopic.exist) {
    newTopic = await topicModel.createOneTopic({ ...result });
  }

  return newTopic;
};

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
  const topicResult = await identifyTopic(
    req.body.topic,
    req.body.parent,
    req.body.children
  );
  if (topicResult.exist) {
    return res
      .status(400)
      .json({ status: "fail", message: "Topic already exist" });
  }

  const topic = await topicModel.createOneTopic({ ...topicResult });
  res.status(400).json({ status: "success", data: topic });
});

export default {
  isLegalTopic,
  checkTopic,
  identifyTopic,
  parseTopic,
  getOneTopic,
  getAllTopic,
  createOneTopic,
};
//reference:https://advancedweb.hu/how-to-use-async-functions-with-array-some-and-every-in-javascript/
