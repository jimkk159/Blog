import React from "react";

//CSS
import classes from "./StyleButton.module.css";

function StyleButton(props) {
  const toggleHandler = (event) => {
    event.preventDefault();
    props.onToggle(props.style);
  };

  //Check button active
  let className = classes["item"];
  if (props.active) {
    className += ` ${classes["item-active"]} ${
      props.isDarkMode
        ? classes["item-dark-active"]
        : classes["item-light-active"]
    }`;
  }

  return (
    <div
      className={`${className} ${
        props.isDarkMode ? classes["item-dark"] : classes["item-light"]
      }`}
      onMouseDown={toggleHandler}
      title={props.label}
      aria-label={props.label}
    >
      {props.icon || props.label}
    </div>
  );
}

export default StyleButton;
