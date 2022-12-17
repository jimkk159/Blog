import React, { useContext } from "react";

//Custom Context
import { ThemeContext } from "../../context/theme-context";

//Custom Component
import classes from "./NavigationHeader.module.css";

function NavigationHeader(props) {
  const { isDarkMode } = useContext(ThemeContext);
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
