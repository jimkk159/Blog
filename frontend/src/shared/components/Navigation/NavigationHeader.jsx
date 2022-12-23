import React from "react";
import { useSelector } from "react-redux";

//Custom Component
import classes from "./NavigationHeader.module.css";

function NavigationHeader(props) {
  const isDarkMode = useSelector((state) => state.theme.value);
  return (
    <header
      className={`${classes["main-header"]} ${
        isDarkMode ? classes["dark"] : classes["light"]
      }`}
    >
      <div className={classes["main-header-container"]}>{props.children}</div>
    </header>
  );
}

export default NavigationHeader;
