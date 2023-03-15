import pool from "../module/mysql/index.js";
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
import HttpError from "../utils/http-error.js";
import queryConnection from "../module/mysql/connection.js";

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
  res.status(201).json({ status: "success", data: topic });
});

//-----------------Patch---------------------
const updateOneTopic = catchAsync(async (req, res, next) => {
  const id = +req.params.id;
  const queryTopic = req.body.topic;
  const queryParent = req.body.parent;
  const queryChildren = req.body.children;

  // 1) Check topic if exist
  let topic = await queryPool.getOne(topic_, [id_], [id]);
  if (!topic) throw new HttpError("Topic not found", 404);

  // 2) Check topic Name if exist
  if (queryTopic) {
    const result = await queryPool.getOne(
      topic_,
      [topic_name_],
      ["" + queryTopic]
    );
    if (result) throw new HttpError("Topic has already been exist", 400);
  }

  // 3) Check parent if exist
  let parent;
  if (queryParent) {
    parent = await queryPool.getOne(topic_, [topic_name_], [queryParent]);
    if (!parent) throw new HttpError("Parent not found", 404);

    // Check if parent circular reference
    const isCircularReference = await topicHelper.checkCircularReference(
      id,
      parent.id
    );
    if (isCircularReference) {
      throw new HttpError("You've created a circular topics");
    }
  }

  // 4) Check children if exist
  let children = [];
  let childrenIds = [];
  if (queryChildren) {
    if (Array.isArray(queryChildren)) children = [...new Set(queryChildren)];
    else if (queryChildren) children = [queryChildren];
    children = await Promise.all(
      children.map((child) => queryPool.getOne(topic_, [topic_name_], [child]))
    );
    if (!children.every((element) => !!element))
      throw new HttpError("Child not found", 404);

    childrenIds = children.map((element) => element.id);
  }

  // 5) Check if parent circular reference
  if (queryParent && queryChildren) {
    const isCircularReference = (
      await Promise.all(
        childrenIds.map((childId) =>
          topicHelper.checkCircularReference(childId, parent.id)
        )
      )
    ).some((element) => element);
    if (isCircularReference)
      throw new HttpError("You've created a circular topics");
  } else if (queryParent) {
    const isCircularReference = await topicHelper.checkCircularReference(
      id,
      parent.id
    );
    if (isCircularReference) {
      throw new HttpError("You've created a circular topics");
    }
  } else if (queryChildren) {
    const isCircularReference = (
      await Promise.all(
        childrenIds.map((childId) =>
          topicHelper.checkCircularReference(childId, id)
        )
      )
    ).some((element) => element);
    if (isCircularReference)
      throw new HttpError("You've created a circular topics");
  }

  // 6) Get the current children to this topic
  const currentChildrenIds = (
    await queryPool.getAll(topic_, {
      parent_id: id,
    })
  ).map((element) => element.id);

  // 7) Who is new child?
  const newChildren = childrenIds.filter(
    (element) => !currentChildrenIds.includes(element)
  );

  // 8) Who is orphan?
  const orphan = currentChildrenIds.filter(
    (element) => !childrenIds.includes(element)
  );

  // 9) Parse the input data
  const cols = [];
  const vals = [];
  if (queryTopic) {
    cols.push(topic_name_);
    vals.push(queryTopic);
  }
  if (queryParent) {
    cols.push(parent_id_);
    vals.push(parent.id);
  }

  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    // 10) Update topic
    if (queryTopic || queryParent) {
      await queryConnection.updateOne(
        connection,
        topic_,
        cols,
        [id_],
        [...vals, id]
      );
    }

    // 11) Update child to this topic
    if (newChildren.length)
      await queryConnection.updateAll(
        connection,
        topic_,
        { parent_id: id },
        id_,
        newChildren
      );

    // 12) Update child to their grandparent
    if (orphan.length)
      await queryConnection.updateAll(
        connection,
        topic_,
        { parent_id: topic.parent_id },
        id_,
        orphan
      );

    await connection.commit();
    connection.release();
  } catch (err) {
    console.log(err);
    await connection.rollback();
    connection.release();
    throw new Error(err);
  }

  next();
});

//-----------------Delete--------------------
const deleteOneTopic = catchAsync(async (req, res, next) => {
  // 1) Delete the topic
  await topicModel.deleteOneTopic(+req.params.id);
  res.status(204).json();
});

export default {
  getOneTopic,
  getAllTopic,
  createOneTopic,
  updateOneTopic,
  deleteOneTopic,
};
//reference:https://advancedweb.hu/how-to-use-async-functions-with-array-some-and-every-in-javascript/
