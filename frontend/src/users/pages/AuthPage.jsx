import React, { useState, useContext, useReducer, useCallback } from "react";

//CSS
import classes from "./AuthPage.module.css";

//Custom Context
import { AuthContext } from "../../shared/context/auth-contex";

//Custom Component
import Card from "../../shared/components/UI/Card";
import Input from "../../shared/components/Form/Input";
import Button from "../../shared/components/Form/Button";

//Validator
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

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

function AuthPage() {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [formState, dispatch] = useReducer(formReducer, {
    inputs: {
      email: { value: "", isValid: false },
      password: { value: "", isValid: false },
    },
    isValid: false,
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

  //Switch 「LoginMode」 & 「SignupMode」
  const switchModeHandler = () => {
    //[LoginMode] => [SignupMode]
    if (isLoginMode) {
      setFormData(
        { ...formState.inputs, username: { value: "", isValid: false } },
        false
      );
    }
    //[SignupMode] => [LoginMode]
    else {
      //Remove the Form state items
      const { username, ...restInputs } = formState.inputs;
      setFormData(
        restInputs,
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  //Auth Form Submit
  const authSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Card className={classes.authentication}>
        <h2>{`${isLoginMode ? "Login" : "SingUp"}`}</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              key="username"
              id="username"
              type="text"
              label="Name"
              onInput={inputHandler}
              validators={[VALIDATOR_REQUIRE()]}
              errorMessage="Please enter your name."
            />
          )}
          {!isLoginMode && <p>upload Image</p>}
          <Input
            key="email"
            id="email"
            type="text"
            label="E-Mail"
            onInput={inputHandler}
            validators={[VALIDATOR_EMAIL()]}
            errorMessage="Please enter a valid email."
          />
          <Input
            key="password"
            id="password"
            type="password"
            label="Password"
            onInput={inputHandler}
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorMessage="Enter at least 6 characters."
          />
          <Button
            type="submit"
            disabled={!formState.isValid}
            content="Submit"
          />
        </form>
        <Button
          onClick={switchModeHandler}
          content={`Switch to ${isLoginMode ? "SingUp" : "Login"}`}
        />
      </Card>
    </>
  );
}

export default AuthPage;
