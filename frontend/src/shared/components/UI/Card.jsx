import React from "react";

//CSS
import classes from "./Card.module.css";

//For Card UI
function Card(props) {
  return (
    <div
      className={`${classes.card} ${
        props.isDarkMode ? classes["dark"] : classes["light"]
      } ${props.className}`}
      style={props.style}
      onClick={props.onClick}
      onMouseDown={props.onMouseDown}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      onMouseMove={props.onMouseMove}
      onMouseOut={props.onMouseOut}
      onMouseOver={props.onMouseOver}
      onMouseUp={props.onMouseUp}
    >
      {props.children}
    </div>
  );
}

export default Card;
