import { createTree, sortTopicByParent } from "./createTree";

const minSpace = 15;
const showLevel = 3;
const colors = [
  "#F866FF",
  "#C566FF",
  "#FFBD66",
  "#7EFF66",
  "#7278FF",
  "#66E4FF",
];

function compareLevel(a, b) {
  if (a.level !== b.level) return a.level - b.level;
  return a.id - b.id;
}

//Calculate Offset
export function calOffset(
  inputTreeData,
  Topic,
  graphicWidth,
  graphicHeight,
  width,
  height
) {
  let spaceX = 0;
  let levelLength = 0;
  let levelOffsetX = 0;
  let totalOffsetX = 0;
  let totalOffsetY = 0;
  for (let i = 0; i < inputTreeData.length; i++) {
    levelLength = inputTreeData[i].length;
    for (let j = 0; j < levelLength; j++) {
      if (inputTreeData[i][j].topic === Topic) {
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
  return [totalOffsetX, totalOffsetY];
}

//Flow Chart Elment Property
export function createSvgElement(
  inputTreeData,
  graphicWidth,
  graphicHeight,
  width,
  height,
  radius,
  userOffsetX,
  userOffsetY,
  totalOffsetX,
  totalOffsetY
) {
  let spaceX;
  let levelLength = 0;
  let levelOffsetX = 0;
  const outputArray = [];
  for (let i = 0; i < inputTreeData.length; i++) {
    levelLength = inputTreeData[i].length;
    if (graphicWidth > (levelLength + 1) * width) {
      spaceX = levelOffsetX = graphicWidth / (levelLength + 1);
    } else {
      spaceX = width + minSpace;
      levelOffsetX = width / 2 + minSpace;
    }

    for (let j = 0; j < levelLength; j++) {
      outputArray.push({
        name: inputTreeData[i][j].topic,
        parent: inputTreeData[i][j].parent,
        x: userOffsetX + totalOffsetX + levelOffsetX + spaceX * j,
        y: userOffsetY + totalOffsetY + (graphicHeight / showLevel) * (i + 1),
        r: radius,
        width: width,
        height: height,
        elementAttr: { fill: colors[i] },
      });
    }
  }
  return outputArray;
}

//Create Flow Chart Element Relationship Array
export function createSvgRelation(inputTreeData, inputSvgElments) {
  let levelLength = 0;
  let prevLevelItems = 0;
  const outputLinkData = [];
  for (let i = 0; i < inputTreeData.length; i++) {
    if (i === 0) continue; //Root Level
    prevLevelItems = prevLevelItems + inputTreeData[i - 1].length;
    levelLength = inputTreeData[i].length;

    for (let j = 0; j < levelLength; j++) {
      //Only Link to Higher Level
      for (let k = 0; k < prevLevelItems; k++) {
        if (
          inputSvgElments[k].name === inputSvgElments[prevLevelItems + j].parent
        ) {
          outputLinkData.push({
            startNode: inputSvgElments[k],
            endNode: inputSvgElments[prevLevelItems + j],
          });
        }
      }
    }
  }
  return outputLinkData;
}

//Create Flow Data
export function createFlowChart({
  Topic,
  graphicWidth,
  graphicHeight,
  width,
  height,
  radius,
  userOffsetX,
  userOffsetY,
  topicData,
}) {
  //Sort Topic by level
  topicData.sort(compareLevel);

  //ReStructure data to Array Tree(Not Node Tree)
  const treeData = createTree(topicData);
  //Sort Tree by Parent
  const initialTreeData = [
    [
      {
        topic: "Root",
        parent: "",
      },
    ],
  ];
  const sortTreeData = sortTopicByParent(initialTreeData, treeData);

  //Find Present Level Offset
  const [totalOffsetX, totalOffsetY] = calOffset(
    sortTreeData,
    Topic,
    graphicWidth,
    graphicHeight,
    width,
    height
  );

  //Create Flow Chart Element Array
  const outputData = createSvgElement(
    sortTreeData,
    graphicWidth,
    graphicHeight,
    width,
    height,
    radius,
    userOffsetX,
    userOffsetY,
    totalOffsetX,
    totalOffsetY
  );

  //Construct Tree Link
  const outputLinkData = createSvgRelation(sortTreeData, outputData);
  return [outputData, outputLinkData];
}
