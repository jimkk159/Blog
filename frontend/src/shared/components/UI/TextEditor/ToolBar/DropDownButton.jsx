import React, { useState } from "react";

//CSS
import classes from "./DropDownButton.module.css";

function DropDownButton(props) {
  const [selectItem, setSelectItem] = useState("");

  //Check button active
  let className = classes["wrapper"];
  const optionItems = props.config.options.map((opt, index) => (
    <option key={index} className="dropdownoption-default">
      {opt}
    </option>
  ));

  const selectHandler = (event) => {
    event.preventDefault();
    setSelectItem(event.target.value);
    props.onToggle(props.config[event.target.value].style);
  };
  return (
    <select
      name={props.id}
      className={`${className} ${
        props.isDarkMode ? classes["wrapper-dark"] : classes["wrapper-light"]
      }`}
      value={selectItem}
      onChange={selectHandler}
    >
      {optionItems}
    </select>
  );
}

export default DropDownButton;
