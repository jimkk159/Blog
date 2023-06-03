import { BiChevronDown } from "react-icons/bi";
import { useCallback, useEffect, useReducer, useState } from "react";

import ChoiceChild from "../helper/ChoiceChild";

const initialState = {
  name: "",
  value: "1",
  displayName: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

function MultiSelectInput({
  name,
  choices,
  isDrop,
  onDrop,
  onInput,
  choiceElement,
  defaultValue,
}) {
  const [isSelected, setIsSelected] = useState(false);
  const [formData, dispatch] = useReducer(reducer, initialState);

  const clickHandler = useCallback(
    (event, choiceName) => {
      event.preventDefault();
      const choice = choices.filter((el) => el.id === event.target.value)[0];
      dispatch({ type: "CHANGE", field: "value", value: event.target.value });
      dispatch({ type: "CHANGE", field: "name", value: choiceName });

      if (choice && choice.id === 1)
        dispatch({
          type: "CHANGE",
          field: "displayName",
          value: "Top",
        });
      else if (choice)
        dispatch({
          type: "CHANGE",
          field: "displayName",
          value: choice?.name,
        });

      onDrop(false);
      setIsSelected(true);
    },
    [onDrop, choices]
  );

  const formValue = formData.value;
  useEffect(() => {
    onInput(name, formValue, true);
  }, [onInput, name, formValue]);

  return (
    <>
      <select name={name} className="hidden" value={formData.value} readOnly>
        <ChoiceChild choices={choices} children={<option />} />
      </select>
      <button
        type="button"
        className="flex w-full flex-col items-center justify-center rounded border bg-white  text-gray-600 shadow ring-gray-200 focus:outline-none"
      >
        <div
          className={"flex w-full items-center "}
          onClick={(e) => {
            e.preventDefault();
            onDrop((prev) => !prev);
          }}
        >
          <label
            htmlFor="ParentId"
            className={`w-full cursor-pointer whitespace-nowrap px-4 py-1 text-sm text-gray-500 hover:bg-gray-50`}
          >
            {isSelected ? formData.displayName : defaultValue}
          </label>
          <BiChevronDown className="mr-2 h-[25px] w-[25px]" />
        </div>
        <div
          className={
            `top-full mt-1 w-max min-w-full bg-white shadow` +
            `${isDrop ? "" : " hidden"}`
          }
        >
          <ul className="rounded border text-left">
            <ChoiceChild
              className="border-b px-2 py-1 text-base hover:bg-gray-100"
              choices={choices}
              children={choiceElement}
              onClick={clickHandler}
            />
          </ul>
        </div>
      </button>
    </>
  );
}

export default MultiSelectInput;
