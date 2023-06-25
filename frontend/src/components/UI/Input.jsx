import { useState, useEffect, useCallback } from "react";

// hooks
import { useInput } from "../../hooks/form-hook";

function Input({
  type,
  name,
  onInput,
  onFocus,
  onBlur,
  className,
  validators,
  placeholder,
  initalValue,
  errorMessage,
  defaultValue,
}) {
  const [isInit, setIsInit] = useState(true);

  // custom hooks
  const {
    inputState,
    setHandler,
    changeHandler,
    blurHandler: inputBlurHandler,
  } = useInput(initalValue, validators);
  const isAlarm = !inputState.isValid && inputState.isTouched;

  // custom functions
  const blurHandler = useCallback(() => {
    if (onBlur) onBlur();
    inputBlurHandler();
  }, [onBlur, inputBlurHandler]);

  // useEffect
  const { value, isValid } = inputState; //prevent useEffect change by isTouched
  useEffect(() => {
    onInput(name, value, isValid);
  }, [onInput, name, value, isValid]);

  useEffect(() => {
    if (defaultValue && isInit) setHandler(defaultValue);
    setIsInit(false);
  }, [defaultValue, isInit, setHandler]);

  return (
    <>
      <input
        id={name}
        type={type}
        name={name}
        className={`${className} ${isAlarm && "border-self-red"}`}
        placeholder={placeholder}
        value={inputState.value}
        onChange={changeHandler}
        onBlur={blurHandler}
        onFocus={onFocus}
      />
      {isAlarm && <p className="text-self-red truncate">{errorMessage}</p>}
    </>
  );
}

export default Input;
