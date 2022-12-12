import React, { useEffect } from "react";

//CSS
import classes from "./Input.module.css";

//Custom Hook
import { useInput } from "../../hooks/form-hook";

function Input(props) {
  const { initalValue, initalIsValid, validators } = props;
  const { inputState, changeHandler, blurHandler } = useInput(
    initalValue,
    initalIsValid,
    validators
  );

  //Monitor value to trigger function
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
