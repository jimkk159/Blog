import React, { useState, useContext, useEffect } from "react";

//Custom Context
import { AuthContext } from "../../shared/context/auth-context";
import { ThemeContext } from "../../shared/context/theme-context";
import { LanguageContext } from "../../shared/context/language-context";

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
  const { isDarkMode } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
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
    <Card className={classes.authentication} isDarkMode={isDarkMode}>
      <h2 className={`${isDarkMode?classes.dark:classes.light}`}>{`${isLoginMode ? language.login : language.signup}`}</h2>
      <hr />
      <form onSubmit={authSubmitHandler}>
        {!isLoginMode && (
          <Input
            key={"username_" + uuidKeys[0]}
            id="username"
            type="text"
            label={language.name}
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            errorMessage={language.validName}
            isDarkMode={isDarkMode}
          />
        )}
        {!isLoginMode && <p>{language.uploadImage}</p>}
        <Input
          key={"email_" + uuidKeys[1]}
          id={emailId}
          type="text"
          label={language.email}
          onInput={inputHandler}
          validators={[VALIDATOR_EMAIL()]}
          errorMessage={language.validEmail}
          isDarkMode={isDarkMode}
        />
        <Input
          key={"password_" + uuidKeys[2]}
          id={passwordId}
          type="password"
          label={language.password}
          onInput={inputHandler}
          validators={[VALIDATOR_MINLENGTH(6)]}
          errorMessage={language.validPassword}
          isDarkMode={isDarkMode}
        />
        <Button
          type="submit"
          disabled={!formState.isValid}
          content={language.submit}
          isDarkMode={isDarkMode}
        />
      </form>
      <Button
        onClick={switchModeHandler}
        content={`${language.switchTo}${
          isLoginMode ? language.login : language.signup
        }${language.loginSuffix}`}
        isDarkMode={isDarkMode}
      />
    </Card>
  );
}

export default AuthForm;
