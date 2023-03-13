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
import {
  checkTopic,
  isLegalTopic,
  identifyTopic,
  parseTopic,
} from "../utils/topic-helper.js";

const child = "`child`";
const children = "`children`";

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
