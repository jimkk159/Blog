import React, { useState, useContext, useEffect } from "react";

//Custom Context
import { AuthContext } from "../../shared/context/auth-context";

//Custom Component
import Card from "../../shared/components/UI/Card";
import Input from "../../shared/components/Form/Input";
import Button from "../../shared/components/Form/Button";

//Custom Hook
import useForm from "../../shared/hooks/form-hook";
import useUuid from "../../shared/hooks/uuid-hook";

//Validator
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

//CSS
import classes from "./AuthForm.module.css";

//Constant Variable
const emailId = "email";
const passwordId = "password";

//Test Data
const Fake_User = [
  { userId: "1", name: "Tom" },
  { userId: "2", name: "Amy" },
];

function AuthForm(props) {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const uuidKeys = useUuid(3);

  const { formState, inputHandler, setFormData } = useForm(
    {
      [emailId]: { value: "", isValid: false },
      [passwordId]: { value: "", isValid: false },
    },
    false
  );

  const { toLogin } = props;
  useEffect(() => {
    if (toLogin !== undefined) {
      setIsLoginMode(!!toLogin);
    }
  }, [toLogin]);

  //Switch Auth Form
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
      const { username, ...restInputs } = formState.inputs; //Remove the Form state items
      setFormData(
        restInputs,
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  //Auth Form Submit
  const { onSubmit } = props;
  const authSubmitHandler = (event) => {
    event.preventDefault();

    if (isLoginMode) {
      auth.login(Fake_User[0].userId);
    } else {
      auth.login(Fake_User[1].userId);
    }

    onSubmit();
  };

  return (
    <Card className={classes.authentication}>
      <h2>{`${isLoginMode ? "Login" : "SingUp"}`}</h2>
      <hr />
      <form onSubmit={authSubmitHandler}>
        {!isLoginMode && (
          <Input
            key={"username_" + uuidKeys[0]}
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
          key={"email_" + uuidKeys[1]}
          id={emailId}
          type="text"
          label="E-Mail"
          onInput={inputHandler}
          validators={[VALIDATOR_EMAIL()]}
          errorMessage="Please enter a valid email."
        />
        <Input
          key={"password_" + uuidKeys[2]}
          id={passwordId}
          type="password"
          label="Password"
          onInput={inputHandler}
          validators={[VALIDATOR_MINLENGTH(6)]}
          errorMessage="Enter at least 6 characters."
        />
        <Button type="submit" disabled={!formState.isValid} content="Submit" />
      </form>
      <Button
        onClick={switchModeHandler}
        content={`Switch to ${isLoginMode ? "SingUp" : "Login"}`}
      />
    </Card>
  );
}

export default AuthForm;
