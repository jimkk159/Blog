//Remove apostrophe
const trimApos = (element) => element.replace(/(^\`+|\`+$)/g, "");

//Juge SQL apostrophe removemoent
const sqlApos = (element) => {
  if (element.trim().startsWith("GROUP_CONCAT(")) return element;
  else if (element.at(-1) === "*") return `\`${trimApos(element)}`;
  return `\`${trimApos(element)}\``;
};

//Juge push query statement
const pushIn = (q, key, operator, isArray) => {
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

const removeDuplicatesById = (jsonArray) => {
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
const convertPrefix = (obj, prefix) => {
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

//Filter Obj
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((element) => {
    if (allowedFields.includes(element)) newObj[element] = obj[element];
  });
  return newObj;
};

//Get Obj without keys
const filterObjWithoutPrefixes = (
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

export default {
  trimApos,
  sqlApos,
  pushIn,
  filterObj,
  convertPrefix,
  removeDuplicatesById,
  filterObjWithoutPrefixes,
};
