import React from "react";
import { Set } from "react-raphael";
import ArrowHead from "./ArrowHead";
import ArrowLine from "./ArrowLine";

function Arrow({ direction, startX, startY, endX, endY, isDarkMode }) {
  if (direction === "UP") {
    return (
      <Set>
        <ArrowHead
          x={startX}
          y={startY}
          isDarkMode={isDarkMode}
          direction={direction}
        />
        <ArrowLine
          startX={startX}
          startY={startY}
          endX={endX}
          endY={endY}
          isDarkMode={isDarkMode}
        />
      </Set>
    );
  }
  return (
    <Set>
      <ArrowHead x={endX} y={endY} isDarkMode={isDarkMode} />
      <ArrowLine
        startX={startX}
        startY={startY}
        endX={endX}
        endY={endY}
        isDarkMode={isDarkMode}
      />
    </Set>
  );
}

export default Arrow;
