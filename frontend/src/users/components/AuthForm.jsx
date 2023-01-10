import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

//Redux Slice
import { authActions } from "../../store/auth-slice";

//Custom Component
import Card from "../../shared/components/UI/Card";
import Input from "../../shared/components/Form/Input";
import Button from "../../shared/components/Form/Button";
import UploadImage from "../../shared/components/Form/UploadImage";
import ErrorModal from "../../shared/components/UI/Modal/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";

//Custom Hook
import useForm from "../../shared/hooks/form-hook";
import useUuid from "../../shared/hooks/uuid-hook";
import useHttp from "../../shared/hooks/http-hook";

//Validator
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

//CSS
import classes from "./AuthForm.module.css";

//Constant Variable
const nameKey = "name";
const imageKey = "image";
const emailKey = "email";
const passwordKey = "password";

//Test Data
const Fake_User = [
  { userId: "1", name: "Tom" },
  { userId: "2", name: "Amy" },
];

function AuthForm(props) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttp();
  //Redux
  const isDarkMode = useSelector((state) => state.theme.value);
  const language = useSelector((state) => state.language.language);
  const dispatch = useDispatch();

  //Custom Hook
  const uuidKeys = useUuid(3);
  const { formState, inputHandler, setFormData } = useForm(
    {
      [emailKey]: { value: "", isValid: false },
      [passwordKey]: { value: "", isValid: false },
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
        {
          ...formState.inputs,
          [nameKey]: { value: "", isValid: false },
          [imageKey]: { value: null, isValid: false },
        },
        false
      );
    }
    //[SignupMode] => [LoginMode]
    else {
      const {
        [nameKey]: name,
        [imageKey]: image,
        ...restInputs
      } = formState.inputs; //Remove the Form state items
      setFormData(
        restInputs,
        formState.inputs[emailKey].isValid &&
          formState.inputs[passwordKey].isValid
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  //Auth Form Submit
  const { onSubmit } = props;
  const authSubmitHandler = async (event) => {
    event.preventDefault();
    //Send Login data to backend
    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "users/login",
          "POST",
          JSON.stringify({
            [emailKey]: formState.inputs[emailKey].value,
            [passwordKey]: formState.inputs[passwordKey].value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        dispatch(authActions.login({ uid: Fake_User[0].userId }));
        onSubmit();
      } catch (err) {}
      //Send Signup data to backend
    } else {
      try {
        const formData = new FormData();
        formData.append(nameKey, formState.inputs[nameKey].value);
        formData.append(imageKey, formState.inputs[imageKey].value);
        formData.append(emailKey, formState.inputs[emailKey].value);
        formData.append(passwordKey, formState.inputs[passwordKey].value);
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/signup",
          "POST",
          formData
        );
        dispatch(authActions.login({ uid: Fake_User[1].userId }));
        onSubmit();
      } catch (err) {}
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className={classes.authentication} isDarkMode={isDarkMode}>
        {isLoading && (
          <>
            <p>Loading...</p>
            <LoadingSpinner asOverlay />
          </>
        )}
        {!isLoading && (
          <>
            <h2 className={`${isDarkMode ? classes.dark : classes.light}`}>{`${
              isLoginMode ? language.login : language.signup
            }`}</h2>
            <hr />
            <form onSubmit={authSubmitHandler}>
              {!isLoginMode && (
                <UploadImage
                  id={imageKey}
                  isDarkMode={isDarkMode}
                  onInput={inputHandler}
                  errorMessage={language.validImage}
                >
                  {language.uploadImage}
                </UploadImage>
              )}
              {!isLoginMode && (
                <Input
                  key={"username_" + uuidKeys[0]}
                  id={nameKey}
                  type="text"
                  label={language.name}
                  onInput={inputHandler}
                  validators={[VALIDATOR_REQUIRE()]}
                  errorMessage={language.validName}
                  isDarkMode={isDarkMode}
                />
              )}
              <Input
                key={"email_" + uuidKeys[1]}
                id={emailKey}
                type="text"
                label={language.email}
                onInput={inputHandler}
                validators={[VALIDATOR_EMAIL()]}
                errorMessage={language.validEmail}
                isDarkMode={isDarkMode}
              />
              <Input
                key={"password_" + uuidKeys[2]}
                id={passwordKey}
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
                isLoginMode ? language.signup : language.login
              }${language.loginSuffix}`}
              isDarkMode={isDarkMode}
            />
          </>
        )}
      </Card>
    </>
  );
}

export default AuthForm;
