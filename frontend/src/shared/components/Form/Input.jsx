import React, { useReducer, useState } from "react";

//CSS
import classes from "./Input.module.css";

//Input Reducer
const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.value,
        isValid: action.value.length >= 6 ? true : false,
      };
    case "TOUCH":
      return { ...state, isTouched: true };
    default:
      return state;
  }
};

function Input(props) {
  //Input Reducer Behavior
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: "",
    isTouched: false, //Check the user touch the input or not
    isValid: false, //Check the the input is valid after user has touched
  });
  const changeHandler = (event) => {
    dispatch({ type: "CHANGE", value: event.target.value });
  };
  const blurHandler = () => {
    dispatch({ type: "TOUCH" });
  };

  return (
    <div
      className={`${classes["input-control"]} ${
        !inputState.isValid && inputState.isTouched && classes["input-invalid"]
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={blurHandler}
        value={inputState.value}
      />
      {!inputState.isValid && inputState.isTouched && (
        <p>{props.errorMessage}</p>
      )}
    </div>
  );
}

export default Input;
