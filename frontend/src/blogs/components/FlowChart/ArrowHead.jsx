import React from "react";
import { Path } from "react-raphael";

const arrowYSpace = 1;
function ArrowHead({ x, y, direction, isDarkMode }) {
  const arrowY = y + arrowYSpace;
  const arrowHeadSize = 8;
  const arrowDirectionY = direction === "UP" ? 1 : -1;
  const arrowHeadPath =
    "M" +
    x +
    " " +
    arrowY +
    "L" +
    (x - arrowHeadSize) +
    " " +
    (arrowY + arrowDirectionY * arrowHeadSize) +
    "L" +
    (x + arrowHeadSize) +
    " " +
    (arrowY + arrowDirectionY * arrowHeadSize) +
    "L" +
    x +
    " " +
    arrowY;
  const arrowHeadAttr = {
    fill: isDarkMode ? "#000" : "#000",
    stroke: isDarkMode ? "#000" : "#000",
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    opacity: 1,
  };

  return <Path d={[arrowHeadPath]} attr={arrowHeadAttr} />;
}

export default ArrowHead;
