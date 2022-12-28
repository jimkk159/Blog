const DUMMY_DATA = [
  {
    id: 0,
    level: 0,
    Topic: "CS",
    Parent: "Root",
    Child: [],
    Title: "Merge Sort",
  },
  {
    id: 1,
    level: 1,
    Topic: "JS",
    Parent: "CS",
    Child: [],
    Title: "What is event loop?",
  },
  {
    id: 2,
    level: 1,
    Topic: "Node",
    Parent: "JS",
    Child: [],
    Title: "How does Node work?",
  },
  {
    id: 3,
    level: 2,
    Topic: "Express",
    Parent: "Node",
    Child: [],
    Title: "What is Express?",
  },
  { id: 4, level: 2, Topic: "React", Parent: "Node", Title: "What is Hook?" },
  { id: 5, level: 2, Topic: "React", Parent: "Node", Title: "What is State?" },
  {
    id: 6,
    level: 2,
    Topic: "React",
    Parent: "Node",
    Child: [],
    Title: "What is Component?",
  },
  { id: 7, level: 3, Topic: "Redux", Parent: "React", Title: "What is store?" },
  {
    id: 8,
    level: 3,
    Topic: "React-Router",
    Parent: "React",
    Child: [],
    Title: "Why use React Router?",
  },
  {
    id: 9,
    level: 3,
    Topic: "React-Router",
    Parent: "React",
    Child: [],
    Title: "What is SPA?",
  },
];

const DUMMY_Tree = [
  { id: 7, level: 5, topic: "React-Router", parent: "React" },
  { id: 6, level: 5, topic: "Redux", parent: "React" },
  { id: 0, level: 0, topic: "Root", parent: "" },
  { id: 1, level: 1, topic: "CS", parent: "Root" },
  { id: 3, level: 3, topic: "Node", parent: "JS" },
  { id: 2, level: 2, topic: "JS", parent: "CS" },
  { id: 5, level: 4, topic: "React", parent: "Node" },
  { id: 4, level: 4, topic: "Express", parent: "Node" },
  { id: 8, level: 5, topic: "Test1", parent: "Express" },
  { id: 9, level: 5, topic: "Test22", parent: "Express" },
  { id: 10, level: 5, topic: "Test333", parent: "Express" },
];

function compareLevel(a, b) {
  if (a.level !== b.level) return a.level - b.level;
  return a.id - b.id;
}

const colors = [
  "#F866FF",
  "#C566FF",
  "#FFBD66",
  "#7EFF66",
  "#7278FF",
  "#66E4FF",
];
const minSpace = 15;
const showLevel = 3;
export function createTree({
  Topic,
  graphicWidth,
  graphicHeight,
  width,
  height,
  userOffsetX,
  userOffsetY,
  radius,
}) {
  const linearData = []; //Linear Structure
  const linkData = [];
  let preLevel = -1;
  let insertIndex = 0;

  //Sort Tree by level
  DUMMY_Tree.sort(compareLevel);

  //Create Tree
  const treeData = []; //Tree Structure
  for (let i = 0; i < DUMMY_Tree.length; i++) {
    if (DUMMY_Tree[i].level !== preLevel) {
      treeData.push([]);
      preLevel++;
    }
    insertIndex = treeData.length - 1;
    treeData[insertIndex].push({
      topic: DUMMY_Tree[i].topic,
      parent: DUMMY_Tree[i].parent,
    });
  }

  //Sort Tree by Parent
  let levelLength = 0;
  let nextLevelLength = 0;
  const sortTreeData = [
    [
      {
        topic: "Root",
        parent: "",
      },
    ],
  ];
  preLevel = 0;
  for (let i = 0; i < treeData.length - 1; i++) {
    sortTreeData.push([]);
    levelLength = treeData[i].length;
    nextLevelLength = treeData[i + 1].length;
    for (let j = 0; j < levelLength; j++) {
      for (let k = 0; k < nextLevelLength; k++) {
        if (treeData[i][j].topic === treeData[i + 1][k].parent) {
          sortTreeData[i + 1].push({
            topic: treeData[i + 1][k].topic,
            parent: treeData[i + 1][k].parent,
          });
        }
      }
    }
  }

  //Find Present Level Offset
  let spaceX = 0;
  let levelOffsetX = 0;
  let totalOffsetX = 0;
  let totalOffsetY = 0;
  for (let i = 0; i < sortTreeData.length; i++) {
    levelLength = sortTreeData[i].length;
    for (let j = 0; j < levelLength; j++) {
      if (sortTreeData[i][j].topic === Topic) {
        totalOffsetY = height - (graphicHeight / showLevel) * i;
        if ((levelLength + 1) * width > graphicWidth) {
          spaceX = width + minSpace;
          levelOffsetX = width / 2 + minSpace;
          if (levelOffsetX + spaceX * j > graphicWidth) {
            totalOffsetX = graphicWidth - 2 * levelOffsetX - spaceX * j;
          }
        }
      }
    }
  }

  //Construct Tree Data
  for (let i = 0; i < sortTreeData.length; i++) {
    levelLength = sortTreeData[i].length;
    if (graphicWidth > (levelLength + 1) * width) {
      spaceX = levelOffsetX = graphicWidth / (levelLength + 1);
    } else {
      spaceX = width + minSpace;
      levelOffsetX = width / 2 + minSpace;
    }

    for (let j = 0; j < levelLength; j++) {
      linearData.push({
        name: sortTreeData[i][j].topic,
        parent: sortTreeData[i][j].parent,
        x: userOffsetX + totalOffsetX + levelOffsetX + spaceX * j,
        y: userOffsetY + totalOffsetY + (graphicHeight / showLevel) * (i + 1),
        r: radius,
        width: width,
        height: height,
        elementAttr: { fill: colors[i] },
      });
    }
  }

  //Construct Tree Link
  let prevLevelItems = 0;
  for (let i = 0; i < sortTreeData.length; i++) {
    if (i === 0) continue; //Root Level
    prevLevelItems = prevLevelItems + sortTreeData[i - 1].length;
    levelLength = sortTreeData[i].length;

    for (let j = 0; j < levelLength; j++) {
      //Only Link to Higher Level
      for (let k = 0; k < prevLevelItems; k++) {
        if (linearData[k].name === linearData[prevLevelItems + j].parent) {
          linkData.push({
            startNode: linearData[k],
            endNode: linearData[prevLevelItems + j],
          });
        }
      }
    }
  }

  return [linearData, linkData];
}
