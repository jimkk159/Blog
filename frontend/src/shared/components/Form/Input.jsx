import React, { useEffect, useReducer } from "react";

//CSS
import classes from "./Input.module.css";

//Validator
import { validate } from "../../util/validators";

//Input Reducer
const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      console.log(
        action.value,
        action.validators,
        validate(action.value, action.validators)
      );
      return {
        ...state,
        value: action.value,
        isValid: validate(action.value, action.validators),
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
    value: props.initalValue || "",
    isTouched: false, //Check the user touch the input or not
    isValid: props.initalValid || false, //Check the the input is valid after user has touched
  });

  const changeHandler = (event) => {
    console.log(event.target.value);
    dispatch({
      type: "CHANGE",
      value: event.target.value,
      validators: props.validators,
    });
  };

  const blurHandler = () => {
    dispatch({ type: "TOUCH" });
  };

  //Monitor value change to trigger function
  const { value, isValid } = inputState; //prevend useEffect change by isTouched
  const { id, onInput } = props; //prevend useEffect change except id and onInput
  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, onInput, value, isValid]);

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
