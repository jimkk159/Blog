import React from "react";

//CSS
import classes from "./Description.module.css";

function Description(props) {
  return <p className={classes["description"]}>{props.content}</p>;
}

export default Description;
