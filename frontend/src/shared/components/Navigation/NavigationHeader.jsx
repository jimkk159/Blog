import React from "react";

//CUSTOM
import classes from "./NavigationHeader.module.css";

function NavigationHeader(props) {
  return <header className={classes["main-header"]}>{props.children}</header>;
}

export default NavigationHeader;
