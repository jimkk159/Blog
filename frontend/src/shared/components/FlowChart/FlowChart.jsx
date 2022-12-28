import React from "react";

//Function
import { createTree } from "./createTree";

//Custom Component
import CirChart from "./CirChart";
import RectChart from "./RectChart";

const cirRadius = 24;
const rectWidth = 80;
const rectHeight = 30;
const rectRadius = 10;
function FlowChart(props) {
  const typePorperty =
    props.type === "rect"
      ? {
          width: rectWidth,
          height: rectHeight,
          radius: rectRadius,
        }
      : {
          width: 2 * cirRadius + 15,
          height: 2 * cirRadius + 20,
          radius: cirRadius,
        };
  const [data, linkData] = createTree({
    Topic: "React",
    graphicWidth: props.width,
    graphicHeight: props.height,
    userOffsetX: props.offsetX,
    userOffsetY: props.offsetY,
    ...typePorperty,
  });

  //Rect FlowChart
  if (props.type === "rect")
    return (
      <RectChart
        width={props.width}
        height={props.height}
        data={data}
        linkData={linkData}
      />
    );

  //Cir FlowChart
  return (
    <CirChart
      width={props.width}
      height={props.height}
      data={data}
      linkData={linkData}
    />
  );
}

export default FlowChart;
