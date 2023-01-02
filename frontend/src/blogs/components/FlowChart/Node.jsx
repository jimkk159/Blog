import React from "react";
import { Set, Circle, Text } from "react-raphael";

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
  const { index, name, x, y, r, onNavTopic } = props;
  const textFontSize =
    name.length > 5
      ? name.length > 6
        ? name.length > 11
          ? "12px"
          : "14px"
        : "16px"
      : "18px";
  const elementAttr = {
    ...defaultElementAttr,
    ...props.elementAttr,
  };
  const textAttr = {
    ...defaultTextAttr,
    "font-size": textFontSize,
    ...props.textAttr,
  };
  const elementAnimate = props.elementAnimate ? props.elementAnimate : null;
  // Raphael.animation({ cx: props.x }, 500, "<>");
  const textAnimate = props.textAnimate ? props.textAnimate : null;
  // Raphael.animation({ x: props.x }, 500, "<>");
  return (
    <Set>
      <Circle
        index={index}
        x={x - 10}
        y={y}
        r={r}
        attr={elementAttr}
        animate={elementAnimate}
        click={() => {
          onNavTopic(name);
        }}
      />
      <Text
        index={index}
        x={x - 10}
        y={y}
        text={name}
        attr={textAttr}
        animate={textAnimate}
      />
    </Set>
  );
}

export default Node;
