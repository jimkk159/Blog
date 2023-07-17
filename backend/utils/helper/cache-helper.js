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
