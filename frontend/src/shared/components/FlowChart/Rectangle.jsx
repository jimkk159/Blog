import React from "react";
import { Raphael, Set, Text, Rect } from "react-raphael";

const defaultElementAttr = {
  fill: "#a966ff",
  stroke: "#333333",
  "stroke-width": 2,
};

const defaultTextAttr = {
  fill: "#000",
  "text-anchor": "middle",
  "font-family": "Menlo, Monaco, Consolas, 'Droid Sans Mono', monospace",
  "font-size": "12px",
  stroke: "none",
  "font-weight": "bold",
  opacity: 1,
  cursor: "pointer",
};

function Rectangle(props) {
  const strokeColor = props.isDarkMode ? "#E4E4E4" : "#333333";
  const textFontSize =
    props.name.length > 5
      ? props.name.length > 8
        ? props.name.length > 11
          ? "12px"
          : "14px"
        : "18px"
      : "20px";
      
  const elementAttr = {
    ...defaultElementAttr,
    stroke: strokeColor,
    ...props.elementAttr,
  };
  const textAttr = {
    ...defaultTextAttr,
    "font-size": textFontSize,
    ...props.textAttr,
  };

  const elementAnimate = props.cirAnimate
    ? props.elementAnimate
    : Raphael.animation({ x: props.x - props.width / 2 }, 500, "<>");
  const textAnimate = props.textAnimate
    ? props.textAnimate
    : Raphael.animation({ x: props.x }, 500, "<>");

  return (
    <Set>
      <Rect
        index={props.index}
        x={props.x - props.width / 2 - 10}
        y={props.y - props.height / 2}
        r={props.r}
        width={props.width}
        height={props.height}
        attr={elementAttr}
        animate={elementAnimate}
      />
      <Text
        index={props.index}
        x={props.x - 10}
        y={props.y}
        text={props.name}
        attr={textAttr}
        animate={textAnimate}
      />
    </Set>
  );
}

export default Rectangle;
