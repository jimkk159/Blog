import { useEffect } from "react";

//Custom Hook
import { useInput } from "../../hooks/form-hook";

function Input({
  type,
  name,
  onInput,
  validators,
  placeholder,
  initalValue,
  errorMessage,
}) {
  const { inputState, changeHandler, blurHandler } = useInput(
    initalValue,
    validators
  );
  const isAlarm = !inputState.isValid && inputState.isTouched;

  const { value, isValid } = inputState; //prevend useEffect change by isTouched
  useEffect(() => {
    onInput(name, value, isValid);
  }, [name, onInput, value, isValid]);

  return (
    <>
      <input
        id={name}
        type={type}
        name={name}
        className={`m-0 my-1.5 box-border h-12 w-full overflow-ellipsis rounded border border-gray-400 bg-[#f8f8f8] px-2 py-2.5 text-base outline-none focus:border-[#510077] focus:bg-[#ebebeb] ${
          isAlarm && "border-[#FF0000]"
        }`}
        placeholder={placeholder}
        value={inputState.value}
        onChange={changeHandler}
        onBlur={blurHandler}
      />
      {isAlarm && <p className="text-[#FF0000]">{errorMessage}</p>}
    </>
  );
}

export default Input;
