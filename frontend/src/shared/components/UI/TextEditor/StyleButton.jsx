import React from "react";

//CSS
import classes from "./StyleButton.module.css";

function StyleButton(props) {
  const toggleHandler = (event) => {
    event.preventDefault();
    props.onToggle(props.style);
  };

  let className = classes["RichEditor-styleButton"];
  if (props.active) {
    className += ` ${classes["RichEditor-activeButton"]}`;
  }

  return (
    <span className={className} onMouseDown={toggleHandler}>
      {props.label}
    </span>
  );
}

export default StyleButton;
