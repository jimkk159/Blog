import React from "react";
import { Set } from "react-raphael";
import ArrowHead from "./ArrowHead";
import ArrowLine from "./ArrowLine";

function Arrow(props) {
  if (props.direction === "UP") {
    return (
      <Set>
        <ArrowHead
          x={props.startX}
          y={props.startY}
          isDarkMode={props.isDarkMode}
          direction={props.direction}
        />
        <ArrowLine
          startX={props.startX}
          startY={props.startY}
          endX={props.endX}
          endY={props.endY}
          isDarkMode={props.isDarkMode}
        />
      </Set>
    );
  }
  return (
    <Set>
      <ArrowHead
        x={props.endX}
        y={props.endY}
        isDarkMode={props.isDarkMode}
      />
      <ArrowLine
        startX={props.startX}
        startY={props.startY}
        endX={props.endX}
        endY={props.endY}
        isDarkMode={props.isDarkMode}
      />
    </Set>
  );
}

export default Arrow;
