import React from "react";

//CSS
import classes from "./StyleButton.module.css";

function StyleButton(props) {
  //Check button active
  let className = classes["item"];
  if (props.active) {
    className += ` ${classes["item-active"]} ${
      props.isDarkMode
        ? classes["item-dark-active"]
        : classes["item-light-active"]
    }`;
  }

  const toggleHandler = (event) => {
    event.preventDefault();
    let onChangeFn;
    switch (typeof props.onChange) {
      case "function":
        onChangeFn = props.onChange;
        onChangeFn(props.style);
        break;
      case "object":
        onChangeFn = props.onChange[props.opt];
        if (onChangeFn) onChangeFn();
        break;
      default:
        break;
    }
  };

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
