import React from "react";

//Icon
import { RxCross2 } from "react-icons/rx";

//Custom Comonent
import Card from "../../../shared/components/UI/Card";
import FlowChart from "../../../shared/components/FlowChart/FlowChart";
import ScrollAnimation from "../../../shared/components/Animation/ScrollAnimation";

//CSS
import classes from "./GuideOpen.module.css";

const cardWidth = 16 * 20 - 16;
const cardHeight = 16 * 20 - 16 - 16 * 4;
function GuideOpen(props) {
  return (
    <ScrollAnimation className={`${props.className}`} top="20%">
      <Card
        className={`${classes["flow-chart-container"]}`}
        isDarkMode={props.isDarkMode}
      >
        <h1
          className={`${classes["title"]} ${
            props.isDarkMode ? classes["title-dark"] : classes["title-light"]
          }`}
        >
          Topic Map
        </h1>
        <FlowChart type="rect" width={cardWidth} height={cardHeight} />
        <RxCross2
          className={`${classes["cross"]} ${
            props.isDarkMode ? classes["cross-dark"] : classes["cross-light"]
          }`}
          onClick={props.onClick}
        />
      </Card>
    </ScrollAnimation>
  );
}

export default GuideOpen;
// reference:https://www.kindacode.com/article/react-get-the-width-height-of-a-dynamic-element/
