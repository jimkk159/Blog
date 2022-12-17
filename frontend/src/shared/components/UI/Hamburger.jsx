import React, { useContext } from "react";

//Custom Context
import { ThemeContext } from "../../context/theme-context";

//CSS
import classes from "./Hamburger.module.css";

function Hamburger(props) {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <button
      className={`${classes.hamburger} ${
        isDarkMode ? classes["dark"] : classes["light"]
      } ${props.className}`}
      onClick={props.onClick}
    >
      <span />
      <span />
      <span />
    </button>
  );
}

export default Hamburger;
