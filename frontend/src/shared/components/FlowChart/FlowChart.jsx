import React from "react";

//Function
import { createFlowData } from "../../util/createFlowData";

//Custom Component
import CirChart from "./CirChart";
import RectChart from "./RectChart";

// const DUMMY_DATA = [
//   {
//     id: 0,
//     level: 0,
//     Topic: "CS",
//     Parent: "Root",
//     Child: [],
//     Title: "Merge Sort",
//   },
//   {
//     id: 1,
//     level: 1,
//     Topic: "JS",
//     Parent: "CS",
//     Child: [],
//     Title: "What is event loop?",
//   },
//   {
//     id: 2,
//     level: 1,
//     Topic: "Node",
//     Parent: "JS",
//     Child: [],
//     Title: "How does Node work?",
//   },
//   {
//     id: 3,
//     level: 2,
//     Topic: "Express",
//     Parent: "Node",
//     Child: [],
//     Title: "What is Express?",
//   },
//   { id: 4, level: 2, Topic: "React", Parent: "Node", Title: "What is Hook?" },
//   { id: 5, level: 2, Topic: "React", Parent: "Node", Title: "What is State?" },
//   {
//     id: 6,
//     level: 2,
//     Topic: "React",
//     Parent: "Node",
//     Child: [],
//     Title: "What is Component?",
//   },
//   { id: 7, level: 3, Topic: "Redux", Parent: "React", Title: "What is store?" },
//   {
//     id: 8,
//     level: 3,
//     Topic: "React-Router",
//     Parent: "React",
//     Child: [],
//     Title: "Why use React Router?",
//   },
//   {
//     id: 9,
//     level: 3,
//     Topic: "React-Router",
//     Parent: "React",
//     Child: [],
//     Title: "What is SPA?",
//   },
// ];

const DUMMY_TopicData = [
  { id: 7, level: 5, topic: "React-Router", parent: "React" },
  { id: 6, level: 5, topic: "Redux", parent: "React" },
  { id: 0, level: 0, topic: "Root", parent: "" },
  { id: 1, level: 1, topic: "CS", parent: "Root" },
  { id: 3, level: 3, topic: "Node", parent: "JS" },
  { id: 2, level: 2, topic: "JS", parent: "CS" },
  { id: 5, level: 4, topic: "React", parent: "Node" },
  { id: 4, level: 4, topic: "Express", parent: "Node" },
  { id: 8, level: 5, topic: "Test1", parent: "Express" },
  { id: 9, level: 5, topic: "Test22", parent: "Express" },
  { id: 10, level: 5, topic: "Test333", parent: "Express" },
];

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
  const [data, linkData] = createFlowData({
    Topic: "Node",
    graphicWidth: props.width,
    graphicHeight: props.height,
    userOffsetX: props.offsetX,
    userOffsetY: props.offsetY,
    topicData: DUMMY_TopicData,
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
