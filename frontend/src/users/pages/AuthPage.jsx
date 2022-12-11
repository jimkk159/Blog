import React, { useContext } from "react";

//CSS
import classes from "./AuthPage.module.css";

//Custom Context
import { AuthContext } from "../../shared/context/auth-contex";

//Custom Component
import Card from "../../shared/components/UI/Card";
import Input from "../../shared/components/Form/Input";
import Button from "../../shared/components/Form/Button";

function AuthPage() {
  const auth = useContext(AuthContext);

  const authSubmitHandler = () => {};
  return (
    <>
      <Card className={classes.authentication}>
        <h1>Login Required</h1>
        <hr />
        <form onSubmit={authSubmitHandler}>
          <Input
          key="username"
            id="username"
            type="text"
            label="Name"
            errorMessage="Please enter your name."
          />
          <Input
          key="email"
            id="email"
            type="text"
            label="E-Mail"
            errorMessage="Please enter a valid email."
          />
          <Input
           key="password"
            id="password"
            type="password"
            label="Password"
            errorMessage="Enter at least 6 characters."
          />
          <Button type="submit" disabled={false}>
            Login
          </Button>
        </form>
      </Card>
    </>
  );
}

export default AuthPage;
