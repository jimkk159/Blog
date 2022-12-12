import React, { useState, useContext } from "react";

//CSS
import classes from "./AuthModal.module.css";

//Custom Context
import { AuthContext } from "../../shared/context/auth-contex";

//Custom Component
import Card from "../../shared/components/UI/Card";
import Input from "../../shared/components/Form/Input";
import Button from "../../shared/components/Form/Button";
import Modal from "../../shared/components/UI/Modal";

//Custom Hook
import useForm from "../../shared/hooks/form-hook";

//Validator
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import useMediaQuery from "../../shared/hooks/media-query-hook";

//Constant Variable
const emailId = "email";
const passwordId = "password";

//Test Data
const Fake_User = [
  { userId: "1", name: "Tom" },
  { userId: "2", name: "Amy" },
];

function AuthModal() {
  const auth = useContext(AuthContext);
  const [showModal, setShowModal] = useState(true);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const { matches } = useMediaQuery("min", "768");
  const { formState, inputHandler, setFormData } = useForm(
    {
      [emailId]: { value: "", isValid: false },
      [passwordId]: { value: "", isValid: false },
    },
    false
  );

  //Custom Modal Style
  const customModalStyle = matches
    ? {
        left: "calc(50% - 12.5rem)",
        width: "25rem",
      }
    : {};

  //Toggle Modal
  //const openModalHandler=()=>setShowModal(true)
  const closeModalHandler = () => {
    setShowModal(false);
    console.log("close");
  };

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
  const authSubmitHandler = (event) => {
    event.preventDefault();

    if (isLoginMode) {
      auth.login(Fake_User[0].userId);
    } else {
      auth.login(Fake_User[1].userId);
    }

    setShowModal(false);
  };

  return (
    <Modal
      show={showModal}
      onCancel={closeModalHandler}
      style={customModalStyle}
    >
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
            id={emailId}
            type="text"
            label="E-Mail"
            onInput={inputHandler}
            validators={[VALIDATOR_EMAIL()]}
            errorMessage="Please enter a valid email."
          />
          <Input
            key="password"
            id={passwordId}
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
    </Modal>
  );
}

export default AuthModal;
