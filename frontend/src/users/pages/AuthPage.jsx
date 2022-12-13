import React from "react";

//CSS
import classes from "./AuthPage.module.css";

//Custom Component
import AuthForm from "../components/AuthForm";

function AuthPage(props) {
  const submitHandler = () => {
    console.log("submit");
  };
  return (
    <div className={classes.authentication}>
      <AuthForm onSubmit={submitHandler} />
    </div>
  );
}

export default AuthPage;
