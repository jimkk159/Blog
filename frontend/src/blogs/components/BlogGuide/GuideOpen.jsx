import React from "react";

//Icon
import { RxCross2 } from "react-icons/rx";
import { AiFillHome } from "react-icons/ai";

//Custom Hook
import useDrag from "../../../shared/hooks/drag-hook";

//Custom Comonent
import Card from "../../../shared/components/UI/Card";
import FlowChart from "../FlowChart/FlowChart";
import ScrollAnimation from "../../../shared/components/Animation/ScrollAnimation";

//CSS
import classes from "./GuideOpen.module.css";

const cardWidth = 16 * 20 - 16;
const cardHeight = 16 * 20 - 16 - 16 * 5;
function GuideOpen(props) {
  const {
    dragState,
    mouseUpHandler,
    mouseDownHandler,
    mouseLeaveHandler,
    mouseMoveHandler,
    resetHandler,
  } = useDrag();
  return (
    <ScrollAnimation className={`${props.className}`} top="20%">
      <Card
        className={`${classes["flow-chart-container"]}`}
        isDarkMode={props.isDarkMode}
        onMouseUp={mouseUpHandler}
        onMouseDown={mouseDownHandler}
        onMouseMove={mouseMoveHandler}
        onMouseLeave={mouseLeaveHandler}
      >
        <h1
          className={`${classes["title"]} ${
            props.isDarkMode ? classes["title-dark"] : classes["title-light"]
          }`}
        >
          Topic Map
        </h1>
        <div
          className={`${classes["chart"]} ${
            props.isDarkMode ? classes["chart-dark"] : classes["chart-light"]
          }`}
        >
          <FlowChart
            type="rect"
            width={cardWidth}
            height={cardHeight}
            offsetX={dragState.offset.x}
            offsetY={dragState.offset.y}
          />
        </div>
        <AiFillHome
          className={`${classes["home"]} ${
            props.isDarkMode ? classes["home-dark"] : classes["home-light"]
          }`}
          onClick={resetHandler}
        />
        <RxCross2
          className={`${classes["cross"]} ${
            props.isDarkMode ? classes["cross-dark"] : classes["cross-light"]
          }`}
          onClick={props.onClose}
        />
      </Card>
    </ScrollAnimation>
  );
}

export default GuideOpen;
// reference:https://www.kindacode.com/article/react-get-the-width-height-of-a-dynamic-element/
