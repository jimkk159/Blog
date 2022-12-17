import React, { useContext } from "react";
import { BsFillMoonFill } from "react-icons/bs";
import { BsSunFill } from "react-icons/bs";

//Custom Context
import { ThemeContext } from "../../context/theme-context";

//Custom Component
import Circle from "../UI/Circle";

//CSS
import classes from "./Theme.module.css";

function Theme(props) {
  const {isDarkMode, switchMode} = useContext(ThemeContext);

  return (
    <Circle
      className={`${props.className} ${classes.theme} ${isDarkMode? classes["dark"]:classes["light"]}`}
      styles={`${props.styles}`}
      onClick={switchMode}
    >
      {isDarkMode ? (
        <BsFillMoonFill className={`${classes.icon}`} />
      ) : (
        <BsSunFill className={`${classes.icon} ${isDarkMode? null:classes["icon-light"]}`} />
      )}
      {props.children}
    </Circle>
  );
}

export default Theme;
