import React from "react";
import { BsFillMoonFill } from "react-icons/bs";
import { BsSunFill } from "react-icons/bs";

//Custom Component
import Circle from "./Circle";

//CSS
import classes from "./Theme.module.css";

function Theme(props) {

  return (
    <Circle
      className={`${props.className} ${classes.theme} ${props.isDarkMode? classes["dark"]:classes["light"]}`}
      styles={`${props.styles}`}
      onClick={props.onSwitch}
    >
      {props.isDarkMode ? (
        <BsFillMoonFill className={`${classes.icon}`} />
      ) : (
        <BsSunFill className={`${classes.icon} ${props.isDarkMode? null:classes["icon-light"]}`} />
      )}
      {props.children}
    </Circle>
  );
}

export default Theme;
