import React from "react";
import { useSelector } from "react-redux";
import { Paper, Set } from "react-raphael";

//Custom Component
import Arrow from "./Arrow";
import Node from "./Node";

const strokWidth = 2;
function CirChart({ width, height, data, linkData, onNavTopic }) {
  const isDarkMode = useSelector((state) => state.theme.value);

  return (
    <Paper width={width} height={height}>
      <Set>
        {data.map(function (element, index) {
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
              onNavTopic={onNavTopic}
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

export default CirChart;
