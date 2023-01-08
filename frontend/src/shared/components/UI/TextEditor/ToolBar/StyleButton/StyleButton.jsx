import React from "react";

//CSS
import classes from "./StyleButton.module.css";

function StyleButton(props) {
  //Check button active
  let buttonClassName = classes["item"];
  if (props.disable) {
    buttonClassName += ` ${classes["item-disable"]}`;
    buttonClassName += props.isDarkMode
    ? ` ${classes["item-disable-dark"]}`
    : ` ${classes["item-disable-light"]}`;
  } else if (props.active) {
    buttonClassName += ` ${classes["item-normal"]} ${classes["item-active"]}`;
    buttonClassName += props.isDarkMode
      ? ` ${classes["item-dark"]} ${classes["item-dark-active"]}`
      : ` ${classes["item-light"]} ${classes["item-light-active"]}`;
  } else {
    buttonClassName += ` ${classes["item-normal"]} ${
      props.isDarkMode ? classes["item-dark"] : classes["item-light"]
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
      className={`${buttonClassName}`}
      onMouseDown={!props.disable ? toggleHandler : null}
      title={props.label}
      aria-label={props.label}
    >
      {props.icon || props.label}
    </div>
  );
}

export default StyleButton;
