import React from "react";
import { Path } from "react-raphael";

function ArrowLine(props) {
  const arrowLinePath =
    "M" +
    props.endX +
    " " +
    props.endY +
    "C" +
    props.endX +
    " " +
    (props.endY - 50) +
    " " +
    props.startX +
    " " +
    (props.startY + 50) +
    " " +
    props.startX +
    " " +
    props.startY;
  const arrowLineAttr = {
    fill: "none",
    stroke: props.isDarkMode ? "#000" : "#000",
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    opacity: 1,
  };
  return <Path d={[arrowLinePath]} attr={arrowLineAttr} />;
}

export default ArrowLine;
