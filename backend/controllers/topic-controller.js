import queryPool from "../module/mysql/pool.js";
import catchAsync from "../utils/catch-async.js";
import apiFeatures from "../utils/api-features.js";
import topicModel from "../module/mysql/topic-model.js";
import {
  id_,
  topic_,
  cover_,
  child_,
  parent_,
  children_,
  topic_name_,
  parent_id_,
} from "../utils/table.js";
import topicHelper from "../utils/topic-helper.js";

//-----------------Get---------------------
const getOneTopic = catchAsync(async (req, res, next) => {
  // 1) Create query instance
  const features = new apiFeatures.getOneFeatures(`${topic_}`, {
    [`${topic_}.${id_}`]: req.params.id,
  })
    .join(
      "LEFT",
      `${topic_} ${child_}`,
      `${topic_}.${id_} = ${child_}.${parent_id_}`
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
      `GROUP_CONCAT(${child_}.${topic_name_} ORDER BY ${child_}.${id_} SEPARATOR \',\') AS ${children_}`,
      `${topic_}.${cover_}`,
    ]);

  // 2) Query topic
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
  // 1) Create query instance
  const features = new apiFeatures.getAllFeatures(`${topic_}`, req.query)
    .join(
      "LEFT",
      `${topic_} ${child_}`,
      `${topic_}.${id_} = ${child_}.${parent_id_}`
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
      `GROUP_CONCAT(${child_}.${topic_name_} ORDER BY ${child_}.${id_} SEPARATOR \',\') AS ${children_}`,
      `${topic_}.${cover_}`,
    ]);

  // 2) Query topic
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
  // 1) Identify the topic
  const topicResult = await topicHelper.identifyTopic(
    req.body.topic,
    req.body.parent,
    req.body.children
  );

  // 2) Topic already exist
  if (topicResult.exist) {
    return res
      .status(400)
      .json({ status: "fail", message: "Topic already exist" });
  }

  // 3) Create topic
  const topic = await topicModel.createOneTopic({ ...topicResult });
  res.status(400).json({ status: "success", data: topic });
});

export default {
  getOneTopic,
  getAllTopic,
  createOneTopic,
};
//reference:https://advancedweb.hu/how-to-use-async-functions-with-array-some-and-every-in-javascript/
