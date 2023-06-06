import { useReducer, useCallback } from "react";

// --------------------------- Input -----------------------------
const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.value,
        isValid: action.validators(action.value),
      };
    case "TOUCH":
      return { ...state, isTouched: true };
    default:
      return state;
  }
};

export function useInput(initalValue, validators) {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: initalValue || "",
    isTouched: false, //Check the user touch the input or not
    isValid: false, //Check the the input is valid after user has touched
  });

  const changeHandler = useCallback(
    (event) =>
      dispatch({
        type: "CHANGE",
        value: event.target.value,
        validators,
      }),
    [validators]
  );

  const setHandler = useCallback(
    (value) =>
      dispatch({
        type: "CHANGE",
        value,
        validators,
      }),
    [validators]
  );

  const blurHandler = useCallback(() => dispatch({ type: "TOUCH" }), []);

  return { inputState, changeHandler, blurHandler, setHandler };
}

const checkFormIsValid = (obj) => {
  for (const key in obj) {
    if (!obj[key].isValid) {
      return false;
    }
  }
  return true;
};

// --------------------------- Form -----------------------------
const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      const inputs = {
        ...state.inputs,
        [action.name]: { value: action.value, isValid: action.isValid },
      };

      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.name]: { value: action.value, isValid: action.isValid },
        },
        isValid: checkFormIsValid(inputs),
      };
    case "SET_DATA":
      return { inputs: action.inputs, isValid: action.isValid };
    default:
      return state;
  }
};

export default function useForm(initialInputs) {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: false,
  });

  //Check Form is valid
  const inputHandler = useCallback(
    (name, value, isValid) =>
      dispatch({
        type: "INPUT_CHANGE",
        name,
        value,
        isValid,
      }),
    []
  );

  //Set Form data
  const setFormData = useCallback(
    (inputs, isValid) =>
      dispatch({
        type: "SET_DATA",
        inputs,
        isValid,
      }),
    []
  );

  //Reset Form data
  const resetFormData = useCallback(
    () =>
      dispatch({
        type: "RESET_DATA",
        inputs: initialInputs,
        isValid: false,
      }),
    [initialInputs]
  );

  return { formState, inputHandler, setFormData, resetFormData };
}
