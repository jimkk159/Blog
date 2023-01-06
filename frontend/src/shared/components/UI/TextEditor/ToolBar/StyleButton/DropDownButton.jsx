import React, { useRef, useState } from "react";
import Select from "react-select";

//CSS
import classes from "./DropDownButton.module.css";

function DropDownButton(props) {
  const selectRef = useRef(null);
  // const [selectItem, setSelectItem] = useState("");
  const [selectedOption, setSelectedOption] = useState({
    label: props.config.options[0],
    value: props.config.options[0],
  });
  // const optionItems = props.config.options.map((opt, index) => (
  //   <option key={index} className="dropdownoption-default">
  //     {opt}
  //   </option>
  // ));
  const optionItems2 = props.config.options.map((opt, index) => ({
    label: opt,
    value: opt,
  }));
  // const selectHandler = (event) => {
  //   event.preventDefault();
  //   setSelectItem(event.target.value);
  //   props.onToggle(props.config.choices[event.target.value].style);
  // };
  const buttonClickHandler = event =>{
    if(selectRef.current){
      selectRef.current.focus();
    }
  }
  const clickHandler = (event) => {
    console.log("div click");
    // event.preventDefault();
  };
  const mouseDownHandler = (event) => {
    console.log("div mouse down");
    // event.preventDefault();
  };
  const selectDownHandler = (event) => {
    console.log("select mouse down");
    // event.preventDefault();
  };
  const selectClickHandler = (event) => {
    console.log("select click");
    // event.preventDefault();
  };
  return (
    <div onMouseDown={mouseDownHandler} onClick={clickHandler}>
      {/* <select
        ref={selectRef}
        name={props.id}
        className={`${props.className} ${classes["wrapper"]} ${
          props.isDarkMode ? classes["wrapper-dark"] : classes["wrapper-light"]
        }`}
        value={selectItem}
        title={props.title}
        aria-label={props.id}
        onChange={selectHandler}
      >
        {optionItems}
      </select> */}
      <Select
        ref={selectRef}
        openMenuOnFocus={true}
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        options={optionItems2}
        onMouseDown={selectDownHandler}
        onClick={selectClickHandler}
        onValueClick={selectClickHandler}
      />
      <button onClick={buttonClickHandler}>Click</button>
    </div>
  );
}

export default DropDownButton;
