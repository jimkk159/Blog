import React, { useContext } from "react";

//Custom Context
import { ThemeContext } from "../../context/theme-context";

//CSS
import classes from "./Card.module.css";

//For Card UI
function Card(props) {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <div
      className={`${classes.card} ${
        isDarkMode ? classes["dark"] : classes["light"]
      } ${props.className}`}
      style={props.style}
    >
      {props.children}
    </div>
  );
}

export default Card;
