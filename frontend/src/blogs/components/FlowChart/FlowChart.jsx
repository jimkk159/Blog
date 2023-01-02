import React from "react";

//Function
import { createFlowChart } from "../../util/createFlowChart.js";

//Custom Component
import CirChart from "./CirChart";
import RectChart from "./RectChart";

const cirRadius = 24;
const rectWidth = 80;
const rectHeight = 30;
const rectRadius = 10;
function FlowChart(props) {
  const { type, width, height, offsetX, offsetY, topics } = props;
  const typePorperty =
    type === "rect"
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
  const [data, linkData] = createFlowChart({
    Topic: "Node",
    graphicWidth: width,
    graphicHeight: height,
    userOffsetX: offsetX,
    userOffsetY: offsetY,
    topicData: topics,
    ...typePorperty,
  });

  //Rect FlowChart
  if (type === "rect")
    return (
      <RectChart
        width={width}
        height={height}
        data={data}
        linkData={linkData}
      />
    );

  //Cir FlowChart
  return (
    <CirChart width={width} height={height} data={data} linkData={linkData} />
  );
}

export default FlowChart;
