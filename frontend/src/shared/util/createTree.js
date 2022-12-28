//Create Tree
export function createTree(topicData) {
  let preLevel = -1;
  let insertIndex = 0;
  const outputArray = []; //Tree Structure
  for (let i = 0; i < topicData.length; i++) {
    if (topicData[i].level !== preLevel) {
      outputArray.push([]);
      preLevel++;
    }
    insertIndex = outputArray.length - 1;
    outputArray[insertIndex].push({
      topic: topicData[i].topic,
      parent: topicData[i].parent,
    });
  }
  return outputArray;
}

//Sort by Parent
export function sortTopicByParent(
  initialTreeData,
  treeData
) {
  let levelLength = 0;
  let nextLevelLength = 0;
  const outputArray = initialTreeData;
  for (let i = 0; i < treeData.length - 1; i++) {
    outputArray.push([]);
    levelLength = treeData[i].length;
    nextLevelLength = treeData[i + 1].length;
    for (let j = 0; j < levelLength; j++) {
      for (let k = 0; k < nextLevelLength; k++) {
        if (treeData[i][j].topic === treeData[i + 1][k].parent) {
          outputArray[i + 1].push({
            topic: treeData[i + 1][k].topic,
            parent: treeData[i + 1][k].parent,
          });
        }
      }
    }
  }
  return outputArray;
}