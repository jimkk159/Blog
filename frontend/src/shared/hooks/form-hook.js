import { useReducer, useCallback } from "react";

//Validator
import { validate } from "../../shared/util/validators";

//Form hook
const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }

      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };
    case "SET_DATA":
      return { inputs: action.inputs, isValid: action.formIsValid };
    default:
      return state;
  }
};

function useForm(initialInputs, initialIsValid) {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialIsValid,
  });

  //Check Form is valid
  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "INPUT_CHANGE",
      inputId: id,
      value: value,
      isValid: isValid,
    });
  }, []);

  //Set Form data
  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: "SET_DATA",
      inputs: inputData,
      formIsValid: formValidity,
    });
  }, []);

  return { formState, inputHandler, setFormData };
}

//Input hook
const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
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

function useInput(initalValue, initalIsValid, validators) {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: initalValue || "",
    isTouched: false, //Check the user touch the input or not
    isValid: initalIsValid || false, //Check the the input is valid after user has touched
  });

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      value: event.target.value,
      validators: validators,
    });
  };

  const blurHandler = () => {
    console.log("onBlur");
    dispatch({ type: "TOUCH" });
  };

  return { inputState, changeHandler, blurHandler };
}

export default useForm;
export { useInput };
