import dotenv from "dotenv";
dotenv.config();

import { cacheClient } from "../../config/cache.js";

export const getOrSetCache = async (key, cb) => {
  try {
    const data = await cacheClient.get(key);
    // Cache Hit
    if (data !== null) {
      console.log(`Cache Hit ${key}`);
      return JSON.parse(data);
    }

    // Cache Miss
    console.log("Cache Miss");
    const dataFromDB = await cb();
    await cacheClient.setEx(
      key,
      process.env.CACHE_EXPIRE_IN,
      JSON.stringify(dataFromDB)
    );
    return dataFromDB;
  } catch (err) {
    console.log(`Cache Error`);
    throw err;
  }
};

export const deleteKey = async (key) => {
  try {
    // Delete the matching keys
    console.log(`Cache Delete ${key}`);
    await cacheClient.del(key);
  } catch (err) {
    console.log(`Cache Error`);
    throw err;
  }
};

export const deleteKeysWithPrefix = async (prefix) => {
  try {
    // Find the matching keys
    const keys = await cacheClient.keys(prefix + "*");
    if (!keys.length) return;

    // Delete the matching keys
    console.log(`Cache Delete ${keys}`);
    await cacheClient.del(keys);
  } catch (err) {
    console.log(`Cache Error`);
    throw err;
  }
};

export const delCache = async (url) => {
  try {
    const urlWithoutId = url.replace(/\/(\d+)(\/)?$/, "");
    await deleteKey(urlWithoutId);
    await deleteKeysWithPrefix(url);
  } catch (err) {
    console.log(`Cache Error`);
    throw err;
  }
};
