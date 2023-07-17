import gravatar from "gravatar";
import Tag from "../module/tag.js";
import Post from "../module/post.js";
import About from "../module/about.js";
import normalize from "normalize-path";
import * as s3 from "../utils/aws/s3.js";
import * as cache from "../config/cache.js";
import Category from "../module/category.js";
import * as helper from "../utils/helper/helper.js";
import { validationResult } from "express-validator";
import { GetFeatures } from "../utils/api-features.js";
import catchAsync from "../utils/error/catch-async.js";
import * as errorTable from "../utils/error/error-table.js";
import * as shareController from "./share-controller.js";

// Validate the req
export const validation = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) throw errorTable.validateError(result.errors);
  next();
};

// Generate Avatar URI
export const isFilePath = (file) => !!(file && file.path);

export const createGravatar = (email) =>
  gravatar.url(email, {
    protocol: "https",
    d: "identicon",
  });

export const createAvatar = (email, file) => {
  if (isFilePath(file)) return normalize(file.path);
  else return shareController.createGravatar(email);
};

export const updateImage = catchAsync(async (req, res, next) => {
  let img;

  if (req.file) {
    const uploadImg = await s3.uploadToS3(req.file);
    img = helper.getImgUrlFromS3(uploadImg);
  }

  res.status(200).json({
    status: "success",
    data: {
      img,
    },
  });
});

export const createAbout = catchAsync(async (req, res) => {
  // create About
  await About.create({ content: helper.modeifiedSyntax(req.body.content) });

  res.status(200).json({ status: "success" });
});

export const getRelation = catchAsync(async (req, res, next) => {
  // Get Data from DB
  const getDataFromDB = async () => {
    // Short posts info
    const query = {
      fields:
        "-content,-AuthorId,-previewImg,-summary,-thumbs,-views,-editedAt",
      sort: "-editedAt",
    };
    const getPosts = new GetFeatures(Post, query).filter().select();
    const posts = await getPosts.findAll({ raw: true });

    // Categories
    const getCategory = new GetFeatures(Category, {})
      .filter()
      .sort()
      .select()
      .paginate();

    const categories = await getCategory.findAll({ raw: true });

    // Tags
    const getTags = new GetFeatures(Tag, {})
      .filter()
      .sort()
      .select()
      .paginate();

    const tags = await getTags.findAll({ raw: true });

    return JSON.stringify({
      tags: {
        count: tags.length,
        data: tags,
      },
      posts: {
        count: posts.length,
        data: posts,
      },
      categories: {
        count: categories.length,
        data: categories,
      },
    });
  };

  // Get Data from DB or Cache
  const result = await cache.getOrSetCache(req.originalUrl, getDataFromDB);
  const data = JSON.parse(result);

  res.status(200).json({
    status: "success",
    data,
  });
});

export const delay = catchAsync(async (req, res, next) => {
  setTimeout(() => {
    next();
  }, 10000);
});

//reference: https://stackoverflow.com/questions/72336177/error-reqlogout-requires-a-callback-function
