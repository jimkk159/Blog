import React from "react";
import { Raphael, Set, Circle, Text } from "react-raphael";

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
const defaultElementAttr = {
  fill: "#a966ff",
  stroke: "#fff",
  "stroke-width": 2,
};

function Node(props) {
  const elementAttr = {
    ...defaultElementAttr,
    ...props.elementAttr,
  };
  const textAttr = {
    ...defaultTextAttr,
    ...props.textAttr,
  };
  const elementAnimate = props.elementAnimate
    ? props.elementAnimate
    : Raphael.animation({ cx: props.x }, 500, "<>");
  const textAnimate = props.textAnimate
    ? props.textAnimate
    : Raphael.animation({ x: props.x }, 500, "<>");
  return (
    <Set>
      <Circle
        index={props.index}
        x={props.x - 10}
        y={props.y}
        r={props.r}
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

export default Node;
