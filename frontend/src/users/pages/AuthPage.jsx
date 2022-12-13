import React from "react";

//Custom Component
import AuthForm from "../components/AuthForm";

//CSS
import classes from "./AuthPage.module.css";

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
