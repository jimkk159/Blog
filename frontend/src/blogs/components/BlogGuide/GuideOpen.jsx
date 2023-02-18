import React from "react";

//Icon
import { RxCross2 } from "react-icons/rx";
import { AiFillHome } from "react-icons/ai";

//Custom Hook
import useDrag from "../../../shared/hooks/drag-hook";

//Custom Comonent
import Card from "../../../shared/components/UI/Card";
import FlowChart from "../FlowChart/FlowChart";

//CSS
import classes from "./GuideOpen.module.css";

const cardWidth = 16 * 20 - 16;
const cardHeight = 16 * 20 - 16 - 16 * 5;
function GuideOpen({
  className,
  topics,
  isEdit,
  isHome,
  isCancel,
  isDarkMode,
  onEdit,
  onClose,
}) {
  const {
    dragState,
    mouseUpHandler,
    mouseDownHandler,
    mouseLeaveHandler,
    mouseMoveHandler,
    resetHandler,
  } = useDrag();

  return (
    <Card
      className={`${className} ${classes["flow-chart-container"]}`}
      isDarkMode={isDarkMode}
      onMouseUp={mouseUpHandler}
      onMouseDown={mouseDownHandler}
      onMouseMove={mouseMoveHandler}
      onMouseLeave={mouseLeaveHandler}
    >
      <h1
        className={`${classes["title"]} ${
          isDarkMode ? classes["title-dark"] : classes["title-light"]
        }`}
      >
        Topic Map
      </h1>
      <div
        className={`${classes["chart"]} ${
          isDarkMode ? classes["chart-dark"] : classes["chart-light"]
        }`}
      >
        <FlowChart
          type="rect"
          width={cardWidth}
          height={cardHeight}
          offsetX={dragState.offset.x}
          offsetY={dragState.offset.y}
          topics={topics}
          isEdit={isEdit}
          onEdit={onEdit}
        />
      </div>
      {isHome && (
        <AiFillHome
          className={`${classes["home"]} ${
            isDarkMode ? classes["home-dark"] : classes["home-light"]
          }`}
          onClick={resetHandler}
        />
      )}
      {isCancel && (
        <RxCross2
          className={`${classes["cross"]} ${
            isDarkMode ? classes["cross-dark"] : classes["cross-light"]
          }`}
          onClick={onClose}
        />
      )}
    </Card>
  );
}

export default GuideOpen;
// reference:https://www.kindacode.com/article/react-get-the-width-height-of-a-dynamic-element/
