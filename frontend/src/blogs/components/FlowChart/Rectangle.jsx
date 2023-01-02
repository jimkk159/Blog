import React from "react";
import { Set, Text, Rect } from "react-raphael";

const defaultElementAttr = {
  fill: "#a966ff",
  stroke: "#333333",
  "stroke-width": 2,
  cursor: "pointer",
};

const defaultTextAttr = {
  fill: "#000",
  "text-anchor": "middle",
  "font-family": "Menlo, Monaco, Consolas, 'Droid Sans Mono', monospace",
  "font-size": "12px",
  stroke: "none",
  "font-weight": "bold",
  opacity: 1,
  
};

function Rectangle(props) {
  const { index, name, x, y, r, width, height, isDarkMode, onNavTopic } = props;
  const strokeColor = isDarkMode ? "#E4E4E4" : "#333333";
  const textFontSize =
    name.length > 5
      ? name.length > 8
        ? name.length > 11
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

  const elementAnimate = props.elementAnimate ? props.elementAnimate : null;
  // Raphael.animation({ x: props.x - props.width / 2 }, 500, "<>");
  const textAnimate = props.textAnimate ? props.textAnimate : null;
  //Raphael.animation({ x: props.x }, 500, "<>");

  return (
    <Set>
      <Rect
        index={index}
        x={x - width / 2}
        y={y - height / 2}
        r={r}
        width={width}
        height={height}
        attr={elementAttr}
        animate={elementAnimate}
        click={() => {
          onNavTopic(name);
        }}
      />
      <Text
        index={index}
        x={x}
        y={y}
        text={name}
        attr={textAttr}
        animate={textAnimate}
      />
    </Set>
  );
}

export default Rectangle;
