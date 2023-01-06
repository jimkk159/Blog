import React from "react";

import classes from "./DropDownOption.module.css";

function DropDown(props) {
  const { style, option, active, disabled, onSelect } = props;

  const selectHandler = (event) => {
    onSelect(option, style);
    console.log(option, style)
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <li
      className={`${classes["option-default"]} 
       ${active && classes["option-active"]} ${
        disabled && classes["option-disable"]
      }`}
      onMouseDown={selectHandler}
    >
      {props.children}
    </li>
  );
}

export default DropDown;
