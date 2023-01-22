import React from "react";

//CSS
import classes from "./Button2.module.css";

function Button2(props) {
  const inputContent = props.content ? props.content : props.children;

  return (
    <button
      className={`${classes.button} ${
        props.isDarkMode ? classes.dark : classes.light
      } ${props.className}`}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {inputContent}
    </button>
  );
}

export default Button2;
