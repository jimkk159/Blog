import React from "react";

//CSS
import classes from "./Rectangle.module.css";

function Rectangle(props) {
  if (props.content)
    return <div className={`${classes["rectangle"]}`}>{props.content}</div>;
  return <div className={`${classes["rectangle"]}`}>{props.children}</div>;
}

export default Rectangle;
