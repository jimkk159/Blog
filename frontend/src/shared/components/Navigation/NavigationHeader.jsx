import React from "react";

//CUSTOM
import classes from "./NavigationHeader.module.css";

function NavigationHeader(props) {
  return (
    <header className={classes["main-header"]}>
      <div className={classes["main-header-container"]}>{props.children}</div>
    </header>
  );
}

export default NavigationHeader;
