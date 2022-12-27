import React from "react";
import { Raphael, Set, Circle, Text } from "react-raphael";

function Node(props) {
  const textAttr = {
    fill: "#000",
    "text-anchor": "middle",
    "font-family": "Menlo, Monaco, Consolas, 'Droid Sans Mono', monospace",
    "font-size": "12px",
    stroke: "none",
    "font-weight": "bold",
    opacity: 1,
    cursor: "pointer",
    ...props.textAttr,
  };
  const cirAttr = {
    fill: "#a966ff",
    stroke: "#fff",
    "stroke-width": 2,
    ...props.cirAttr,
  };
  const cirAnimation = props.cirAnimation
    ? props.cirAnimation
    : Raphael.animation({ cx: props.x }, 500, "<>");
  const textAnimation = props.textAnimation
    ? props.textAnimation
    : Raphael.animation({ x: props.x }, 500, "<>");
  return (
    <Set>
      <Circle
        index={props.index}
        x={props.x - 10}
        y={props.y}
        r={props.r}
        attr={cirAttr}
        animate={cirAnimation}
      />
      <Text
        index={props.index}
        x={props.x - 10}
        y={props.y}
        text={props.name}
        attr={textAttr}
        animate={textAnimation}
      />
    </Set>
  );
}

export default Node;
