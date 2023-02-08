import React from "react";
import { Path } from "react-raphael";

function ArrowLine({ startX, startY, endX, endY, isDarkMode }) {
  const arrowLinePath =
    "M" +
    endX +
    " " +
    endY +
    "C" +
    endX +
    " " +
    (endY - 50) +
    " " +
    startX +
    " " +
    (startY + 50) +
    " " +
    startX +
    " " +
    startY;
  const arrowLineAttr = {
    fill: "none",
    stroke: isDarkMode ? "#000" : "#000",
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    opacity: 1,
  };
  return <Path d={[arrowLinePath]} attr={arrowLineAttr} />;
}

export default ArrowLine;
