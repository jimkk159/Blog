import React from "react";

//CSS
import classes from "./Seperation.module.css";

function Seperation(props) {
  const n = props.repeat ? props.repeat : 3;
  const dots = [...Array(n)].map((element, index) => (
    <span
      key={index}
      className={`${classes["dot"]} ${
        props.isDarkMode
          ? classes["dark"]
          : classes["light"]
      }`}
    ></span>
  ));
  return <div className={classes["seperation"]}>{dots}</div>;
}

export default Seperation;
