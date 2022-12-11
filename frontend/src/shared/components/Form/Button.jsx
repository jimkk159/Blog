import React from "react";

//CSS
import classes from "./Button.module.css";

function Button(props) {
    const inputContent = props.content ? props.content : props.children;

  return (
    <button
      className={`${classes.button} ${props.className}`}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {inputContent}
    </button>
  );
}

export default Button;
