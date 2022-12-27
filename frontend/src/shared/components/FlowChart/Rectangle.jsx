import React from "react";
import { Raphael, Set, Text, Rect } from "react-raphael";

function Rectangle(props) {
  const textAttr = {
    fill: "#000",
    "text-anchor": "middle",
    "font-family": "Menlo, Monaco, Consolas, 'Droid Sans Mono', monospace",
    "font-size": "12px",
    stroke: "none",
    "font-weight": "bold",
    opacity: 1,
    cursor: "pointer",
  };
  const cirAttr = {
    fill: "#a966ff",
    stroke: props.isDarkMode?"#E4E4E4":"#333333",
    "stroke-width": 2,
    ...props.cirAttr,
  };
  return (
    <Set>
      <Rect
        index={props.index}
        x={props.x - props.width / 2 - 10}
        y={props.y - props.height / 2}
        r={props.r}
        width={props.width}
        height={props.height}
        attr={cirAttr}
        animate={Raphael.animation({ x: props.x - props.width / 2 }, 500, "<>")}
      />
      <Text
        index={props.index}
        x={props.x - 10}
        y={props.y}
        text={props.name}
        attr={textAttr}
        animate={Raphael.animation({ x: props.x }, 500, "<>")}
      />
    </Set>
  );
}

export default Rectangle;
