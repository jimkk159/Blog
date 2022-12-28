import React from "react";
import { useSelector } from "react-redux";
import { Paper, Set } from "react-raphael";

//Custom Component
import Arrow from "./Arrow";
import Rectangle from "./Rectangle";

const strokWidth = 2;
function RectChart(props) {
  const { width, height, data, linkData } = props;
  const isDarkMode = useSelector((state) => state.theme.value);

  return (
    <Paper width={width} height={height}>
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
                element.startNode.y + element.startNode.height / 2 + strokWidth
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
}

export default RectChart;
