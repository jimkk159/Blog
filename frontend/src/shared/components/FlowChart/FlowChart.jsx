import React from "react";
import { Paper, Set } from "react-raphael";
import { useSelector } from "react-redux";

//Custom Component
import Arrow from "./Arrow";
import Node from "./Node";
import Rectangle from "./Rectangle";

//Function
import { createTree } from "./createTree";

const strokWidth = 2;
const rectWidth = 80;
const rectHeight = 30;
const rectRadius = 10;
function FlowChart(props) {
  const isDarkMode = useSelector((state) => state.theme.value);
  const [data, linkData] = createTree({
    Topic: "React-Router",
    graphicWidth: props.width,
    graphicHeight: props.height,
    width: rectWidth,
    height: rectHeight,
    radius: rectRadius,
  });
  const rectData = [
    {
      name: "A1",
      x: props.width / 2,
      y: rectHeight,
      r: rectRadius,
      width: rectWidth,
      height: rectHeight,
      elementAttr: { fill: "#F866FF" },
    },
    {
      name: "A2",
      x: props.width / 2,
      y: rectHeight + props.width / 3,
      r: 10,
      width: 80,
      height: 30,
      elementAttr: { fill: "#C566FF" },
    },
    {
      name: "A3",
      x: props.width / 2,
      y: rectHeight + (props.width * 2) / 3,
      r: 10,
      width: 80,
      height: 30,
      elementAttr: { fill: "#FFBD66" },
    },
    {
      name: "A4",
      x: props.width / 2,
      y: rectHeight + (props.width * 3) / 3,
      r: 10,
      width: 80,
      height: 30,
      elementAttr: { fill: "#7EFF66" },
    },
    {
      name: "A5",
      x: 50,
      y: 450,
      r: 10,
      width: 80,
      height: 30,
      elementAttr: { fill: "#7278FF" },
    },
    {
      name: "A6",
      x: 50,
      y: 550,
      r: 10,
      width: 80,
      height: 30,
      elementAttr: { fill: "#66E4FF" },
    },
  ];
  const rectLinkData = [
    { startNode: rectData[0], endNode: rectData[1] },
    { startNode: rectData[1], endNode: rectData[2] },
    { startNode: rectData[2], endNode: rectData[3] },
    { startNode: rectData[3], endNode: rectData[4] },
    { startNode: rectData[4], endNode: rectData[5] },
  ];
  const nodeData = [
    { name: "A1", x: 50, y: 50, r: 17, elementAttr: { fill: "#F866FF" } },
    { name: "A2", x: 50, y: 150, r: 17, elementAttr: { fill: "#C566FF" } },
    { name: "A3", x: 150, y: 250, r: 17, elementAttr: { fill: "#FFBD66" } },
    { name: "A4", x: 50, y: 350, r: 17, elementAttr: { fill: "#7EFF66" } },
    { name: "A5", x: 50, y: 450, r: 17, elementAttr: { fill: "#7278FF" } },
    { name: "A6", x: 50, y: 550, r: 17, elementAttr: { fill: "#66E4FF" } },
  ];
  const nodeLinkData = [
    { startNode: nodeData[0], endNode: nodeData[1] },
    { startNode: nodeData[1], endNode: nodeData[2] },
    { startNode: nodeData[2], endNode: nodeData[3] },
    { startNode: nodeData[3], endNode: nodeData[4] },
    { startNode: nodeData[4], endNode: nodeData[5] },
  ];

  if (props.type === "rect")
    return (
      <Paper width={props.width} height={props.height}>
        <Set>
          {data.map(function (element, index) {
            return (
              <Rectangle
                key={index}
                index={index}
                name={element.name}
                x={element.x}
                y={element.y}
                r={element.r}
                width={element.width}
                height={element.height}
                elementAttr={element.elementAttr}
                elementAnimate={element.elementAnimate}
                textX={element.x}
                textY={element.y}
                textAttr={element.textAttr}
                textAnimate={element.textAnimate}
                isDarkMode={isDarkMode}
              />
            );
          })}
        </Set>
        <Set>
          {linkData.map(function (element, index) {
            return (
              <Arrow
                key={index}
                index={index}
                startX={element.startNode.x}
                startY={Math.floor(
                  element.startNode.y +
                    element.startNode.height / 2 +
                    strokWidth
                )}
                endX={element.endNode.x}
                endY={Math.floor(
                  element.endNode.y - element.endNode.height / 2 - strokWidth
                )}
                isDarkMode={isDarkMode}
              />
            );
          })}
        </Set>
      </Paper>
    );

  return (
    <Paper width={props.width} height={props.height}>
      <Set>
        {nodeData.map(function (element, index) {
          return (
            <Node
              key={index}
              index={index}
              name={element.name}
              x={element.x}
              y={element.y}
              r={element.r}
              elementAttr={element.elementAttr}
              elementAnimate={element.elementAnimate}
              textX={element.x}
              textY={element.y}
              textAttr={element.textAttr}
              textAnimate={element.textAnimate}
              isDarkMode={isDarkMode}
            />
          );
        })}
      </Set>
      <Set>
        {nodeLinkData.map(function (element, index) {
          return (
            <Arrow
              key={index}
              index={index}
              startX={element.startNode.x}
              startY={element.startNode.y + element.startNode.r + strokWidth}
              endX={element.endNode.x}
              endY={element.endNode.y - element.endNode.r - strokWidth}
              isDarkMode={isDarkMode}
            />
          );
        })}
      </Set>
    </Paper>
  );
}

export default FlowChart;
