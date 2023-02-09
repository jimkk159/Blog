//Create Tree
export function createTree({ head, topicData }) {
  const root = topicData.filter(
    (topic) => topic?.name.toLowerCase() === head
  )[0];
  const tree = [[{ ...root }]];
  // restData = topicData.filter((topic) => topic?.name.toLowerCase() !== head);
  if (!root) return [];
  //DFS
  const dfs = (array, target, lv) => {
    if (array.length === 0) return;
    const result = array.filter((item) => {
      return item.parent === target;
    });
    if (result.length === 0) return;
    const restArray = array.filter((item) => {
      return item.parent !== target;
    });
    if (lv >= tree.length) tree.push([]);
    tree[lv].push(...result);
    result.forEach((item) => {
      dfs(restArray, item.name, lv + 1);
    });
  };
  dfs(topicData, root.name, 1);
  return tree;
}

//Sort by Parent
export function sortTopicByParent(treeData) {
  let levelLength = 0;
  let nextLevelLength = 0;
  if (treeData.length === 0 || treeData[0].length === 0) return [];
  const initialTreeData = [
    { topic: treeData[0][0].name, parent: treeData[0][0].parent },
  ];
  const outputArray = [initialTreeData];
  for (let i = 0; i < treeData.length - 1; i++) {
    outputArray.push([]);
    levelLength = treeData[i].length;
    nextLevelLength = treeData[i + 1].length;
    for (let j = 0; j < levelLength; j++) {
      for (let k = 0; k < nextLevelLength; k++) {
        if (treeData[i][j].name === treeData[i + 1][k].parent) {
          outputArray[i + 1].push({
            topic: treeData[i + 1][k].name,
            parent: treeData[i + 1][k].parent,
          });
        }
      }
    }
  }
  return outputArray;
}
