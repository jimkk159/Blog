import React, { useReducer, useState } from "react";

import classes from "./Input.module.css";

// const inputReducer = (state, action) => {
//   switch (action.type) {
//   }
// };

function Input(props) {
  //   const [inputState, dispatch] = useReducer(inputReducer, {
  //     value: "",
  //     isTouched: false, //Check the user touch the input or not
  //     isValid: false, //Check the the input is valid after user has touched
  //   });
  const [value, setValue] = useState("");
  const [isToudched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const changeHandler = (event) => {
    setValue(event.target.value);
    if (event.target.value.length >= 6) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };
  const blurHandler = () => {
    setIsTouched(true);
  };
  return (
    <div className={`${classes["input-control"]} ${!isValid && isToudched && classes["input-invalid"]}`}>
      <label htmlFor={props.id}>{props.label}</label>
      <input
        id={props.id}
        type={props.type}
        onChange={changeHandler}
        onBlur={blurHandler}
        value={value}
      />
      {!isValid && isToudched && <p>{props.errorMessage}</p>}
    </div>
  );
}

export default Input;
