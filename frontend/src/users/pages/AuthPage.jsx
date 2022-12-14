import React from "react";
import { useLocation } from "react-router-dom";

//Custom Component
import AuthForm from "../components/AuthForm";

//CSS
import classes from "./AuthPage.module.css";

function AuthPage(props) {
  const location = useLocation();
  const toLogin = location.state ? location.state.toLogin : true;
  const submitHandler = () => {
  };

  return (
    <div className={classes.authentication}>
      <AuthForm onSubmit={submitHandler} toLogin={toLogin} />
    </div>
  );
}

export default AuthPage;
