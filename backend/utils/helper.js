import queryPool from "../module/mysql/pool.js";
import { id_, topic_, topic_name_ } from "../utils/table.js";

//Remove apostrophe
export const trimApos = (element) => element.replace(/(^\`+|\`+$)/g, "");

//Juge SQL apostrophe removemoent
export const sqlApos = (element) => {
  if (element.trim().startsWith("GROUP_CONCAT(")) return element;
  else if (element.at(-1) === "*") return `\`${trimApos(element)}`;
  return `\`${trimApos(element)}\``;
};

//Juge push query statement
export const pushIn = (q, key, operator, isArray) => {
  let insertKey;
  let questionMarks = isArray ? "(?)" : "?";
  if (Array.isArray(key)) {
    insertKey = key.map((element) => `${sqlApos(element)}`).join(".");
    return q.push(`${insertKey} ${operator} ${questionMarks}`);
  }

  if (key.includes(".")) {
    insertKey = key
      .split(".")
      .map((element) => `${sqlApos(element)}`)
      .join(".");
    return q.push(`${insertKey} ${operator} ${questionMarks}`);
  }

  return q.push(`${`${sqlApos(key)}`} ${operator} ${questionMarks}`);
};

export const removeDuplicatesById = (jsonArray) => {
  const uniqueIds = [];
  const resultArray = [];

  // Loop through each object in the array
  for (let i = 0; i < jsonArray.length; i++) {
    // Check if the ID of the current object has already been added to the unique IDs array
    if (uniqueIds.indexOf(jsonArray[i].id) === -1) {
      // Add the ID to the unique IDs array and add the object to the result array
      uniqueIds.push(jsonArray[i].id);
      resultArray.push(jsonArray[i]);
    }
  }

  // Return the result array with unique objects
  return resultArray;
};

//Extract the obj
export const convertPrefix = (obj, prefix) => {
  let newObj = {};

  //Prefix target
  for (let [key, value] of Object.entries(obj)) {
    if (key.startsWith(prefix)) {
      let newKey = key.slice(prefix.length);
      newObj[newKey] = value;
    }
  }
  return newObj;
};

//Get Obj without keys
export const getObjWithoutKeys = (
  originalObj,
  excludedKeys = [],
  prefixes = []
) => {
  let newObj = {};
  for (let [key, value] of Object.entries(originalObj)) {
    if (
      !excludedKeys.includes(key) &&
      !prefixes.some((prefix) => key.startsWith(prefix))
    ) {
      newObj[key] = value;
    }
  }
  return newObj;
};

export const restructPost = (post) => {
  const postObj = getObjWithoutKeys(post, ["tags"], ["en_", "ch_"]);
  const tags = post.tags ? post.tags.split(",") : [];

  const en = convertPrefix(post, "en_") ?? {};
  const ch = convertPrefix(post, "ch_") ?? {};

  return {
    ...postObj,
    tags,
    content: {
      en,
      ch,
    },
  };
};

export default {
  trimApos,
  sqlApos,
  pushIn,
  removeDuplicatesById,
  convertPrefix,
  getObjWithoutKeys,
  restructPost,
};
