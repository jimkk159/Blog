import Redis from "redis";
import dotenv from "dotenv";
dotenv.config();

import * as cacheConfigHelpr from "./cache-config-helper.js";

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

export const creatRedisServerURL = () => {
  if (isLocal) return cacheConfigHelpr.createRedisLocal();
  if (isTLS) return cacheConfigHelpr.createRedisRemoteTLS();
  return cacheConfigHelpr.createRedisRemote();
};
