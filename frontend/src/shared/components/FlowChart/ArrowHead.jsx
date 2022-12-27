import React from "react";
import { Path } from "react-raphael";

const arrowYSpace = 1;
function ArrowHead(props) {
  const arrowY = props.y + arrowYSpace;
  const arrowHeadSize = 8;
  const arrowDirectionY = props.direction === "UP" ? 1 : -1;
  const arrowHeadPath =
    "M" +
    props.x +
    " " +
    arrowY +
    "L" +
    (props.x - arrowHeadSize) +
    " " +
    (arrowY + arrowDirectionY * arrowHeadSize) +
    "L" +
    (props.x + arrowHeadSize) +
    " " +
    (arrowY + arrowDirectionY * arrowHeadSize) +
    "L" +
    props.x +
    " " +
    arrowY;
  const arrowHeadAttr = {
    fill: props.isDarkMode ? "#000" : "#333333",
    stroke: props.isDarkMode ? "#000" : "#333333",
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    opacity: 1,
  };

  return <Path d={[arrowHeadPath]} attr={arrowHeadAttr} />;
}

export default ArrowHead;
