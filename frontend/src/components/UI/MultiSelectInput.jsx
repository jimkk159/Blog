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
  defaultName,
  choices,
  current,
  isDrop,
  onDrop,
  onInput,
  choiceElement,
  defaultValue,
}) {
  const [isSelected, setIsSelected] = useState(false);
  const [formData, dispatch] = useReducer(reducer, initialState);

  // custom functions
  const clickHandler = useCallback(
    (event, choiceName) => {
      event.preventDefault();
      event.stopPropagation();
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

  // useEffect
  const formValue = formData.value;
  useEffect(() => {
    if (onInput) onInput(name, formValue, true);
  }, [onInput, name, formValue]);

  return (
    <>
      <select name={name} className="hidden" value={formData.value} readOnly>
        <ChoiceChild choices={choices} children={<option />} />
      </select>
      <button
        type="button"
        className="flex w-full flex-col items-center justify-center rounded border bg-white text-gray-600 shadow ring-gray-200 focus:outline-none"
      >
        <div
          className={"flex w-full items-center"}
          onClick={(e) => {
            e.preventDefault();
            onDrop((prev) => !prev);
          }}
        >
          <label
            htmlFor="ParentId"
            className={`w-full cursor-pointer truncate whitespace-nowrap px-4 py-1 text-sm text-gray-500 hover:bg-gray-50`}
          >
            {isSelected ? formData.displayName : defaultValue}
          </label>
          <BiChevronDown className="mr-2 h-[25px] w-[25px]" />
        </div>
        <div
          className={
            `relative top-full mt-1 w-full min-w-full bg-white shadow` +
            `${isDrop ? "" : " hidden"}`
          }
        >
          <ul className="absolute left-0 top-0 h-32 w-full overflow-y-scroll rounded border text-left bg-white ">
            <ChoiceChild
              className="w-full truncate border-b bg-white px-2 py-1 text-base hover:bg-gray-100"
              current={current}
              choices={choices}
              children={choiceElement}
              defaultName={defaultName}
              onClick={clickHandler}
            />
          </ul>
        </div>
      </button>
    </>
  );
}

export default MultiSelectInput;
