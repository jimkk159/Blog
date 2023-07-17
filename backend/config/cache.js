import * as cacheConfigHelper from "../utils/helper/cache-config-helper.js";

// Connect to Redis
export const cacheClient = cacheConfigHelper.creatRedisServerURL();
(async () => await cacheClient.connect())();
