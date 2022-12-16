import React, { useEffect, useState } from "react";
import { BsFillMoonFill } from "react-icons/bs";
import { BsSunFill } from "react-icons/bs";

//Custom Component
import Circle from "../UI/Circle";

//CSS
import classes from "./Theme.module.css";

function Theme(props) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const switchThemeHandler = () => {
    setIsDarkMode((prevMode) => !prevMode);
    if (props.onClick) {
      props.onClick();
    }
  };

  //Initial Theme
  const { isDarkMode: initialThemeMode } = props;
  useEffect(() => {
    if (initialThemeMode) {
      setIsDarkMode(true);
    }
  }, [initialThemeMode]);

  return (
    <Circle
      className={`${props.className} ${classes.theme}`}
      styles={`${props.styles}`}
      onClick={switchThemeHandler}
    >
      {isDarkMode ? (
        <BsFillMoonFill className={classes.icon} />
      ) : (
        <BsSunFill className={classes.icon} />
      )}
      {props.children}
    </Circle>
  );
}

export default Theme;
