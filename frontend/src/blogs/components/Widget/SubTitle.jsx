import React from "react";

//CSS
import classes from "./SubTitle.module.css";

function SubTitle(props) {
  return <h2 className={classes["sub-title"]}>{props.content}</h2>;
}

export default SubTitle;
