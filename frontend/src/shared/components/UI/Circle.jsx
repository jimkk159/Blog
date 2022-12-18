import React from "react";

//CSS
import classes from "./Circle.module.css";

//For Circle UI
function Circle(props) {
  if (props.content)
    return (
      <div
        className={`${classes.circle} ${props.className}`}
        style={props.style}
        onClick={props.onClick}
      >
        {props.content}
      </div>
    );
  return (
    <div
      className={`${classes.circle} ${props.className}`}
      style={props.style}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
}

export default Circle;
