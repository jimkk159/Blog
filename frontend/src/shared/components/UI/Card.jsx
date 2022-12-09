import React from "react";

//CSS
import classes from "./Card.module.css";

//For Card UI CSS
function Card(props) {
  return (
    <div className={`${classes.card} ${classes.className}`} style={props.style}>
      {props.children}
    </div>
  );
}

export default Card;
