import React from "react";

//CSS
import classes from "./Hamburger.module.css";

function Hamburger(props) {
  return (
    <button
      className={`${classes.hamburger} ${
        props.isDarkMode ? classes["dark"] : classes["light"]
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
