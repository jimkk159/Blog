import Redis from "redis";
import dotenv from "dotenv";
dotenv.config();

import * as cache from "./cache.js";

const isTLS = !!process.env.REDIS_SERVER_AUTH_TOKEN;
const isLocal = !(
  !!process.env.REDIS_SERVER_URL && !!process.env.REDIS_SERVER_PORT
);

export const createRedisLocal = () => {
  console.log(`Reis Server running locally `);
  return Redis.createClient();
};

export const createRedisRemote = () => {
  console.log(
    `Reis Sever running on ${
      "redis://" +
      process.env.REDIS_SERVER_URL +
      ":" +
      process.env.REDIS_SERVER_PORT
    }`
  );
  return Redis.createClient({
    url:
      "redis://" +
      process.env.REDIS_SERVER_URL +
      ":" +
      process.env.REDIS_SERVER_PORT,
  });
};

export const createRedisRemoteTLS = () => {
  console.log(
    `Reis Sever running on ${
      "redis://" +
      process.env.REDIS_SERVER_URL +
      ":" +
      process.env.REDIS_SERVER_PORT
    } by TLS`
  );

  const socket = {
    tls: true,
    host: process.env.REDIS_SERVER_URL,
    port: process.env.REDIS_SERVER_PORT,
  };

  return Redis.createClient({
    socket,
    password: process.env.REDIS_SERVER_AUTH_TOKEN,
  });
};

const creatRedisServerURL = () => {
  if (isLocal) return cache.createRedisLocal();
  if (isTLS) return cache.createRedisRemoteTLS();
  return cache.createRedisRemote();
};

// Connect to Redis
const clientClient = creatRedisServerURL();
(async () => await clientClient.connect())();

export const getOrSetCache = async (key, cb) => {
  try {
    const data = await clientClient.get(key);
    // Cache Hit
    if (data !== null) {
      console.log(`Cache Hit ${key}`);
      return JSON.parse(data);
    }

    // Cache Miss
    console.log("Cache Miss");
    const dataFromDB = await cb();
    await clientClient.setEx(
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
