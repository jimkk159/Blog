import React from "react";

//Custom Component
import classes from "./NavigationHeader.module.css";

function NavigationHeader(props) {
  return (
    <header
      className={`${classes["main-header"]} ${
        props.isDarkMode ? classes["dark"] : classes["light"]
      }`}
    >
      <div className={classes["main-header-container"]}>{props.children}</div>
    </header>
  );
}

export default NavigationHeader;
