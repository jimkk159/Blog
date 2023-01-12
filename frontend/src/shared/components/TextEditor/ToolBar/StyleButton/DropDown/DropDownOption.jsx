import React from "react";

import classes from "./DropDownOption.module.css";

function DropDown(props) {
  const { style, option, active, disabled, onSelect } = props;

  const selectHandler = (event) => {
    onSelect(option, style);
    //Prevent the Text Editor Selection
    event.preventDefault();
     //Prevent Click other area
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
