import React from "react";

//CSS
import classes from "./Hamburger.module.css";

function Hamburger(props) {
  return (
    <button className={`${classes.hamburger} ${props.className}`} onClick={props.onClick}>
      <span />
      <span />
      <span />
    </button>
  );
}

export default Hamburger;
