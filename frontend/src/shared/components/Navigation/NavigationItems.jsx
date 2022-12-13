import React, { useContext } from "react";

//CSS
import classes from "./NavigationItems.module.css";

//Custom Context
import { AuthContext } from "../../context/auth-contex";

//Custom Component
import NavigationItem from "./NavigationItem";

function NavigationItems(props) {
  const auth = useContext(AuthContext);

  return (
    <ul className={classes["nav-links"]}>
      <NavigationItem key="home" to="/" content="HOME" />
      <NavigationItem key="about" to="/about" content="ABOUT" />
      <NavigationItem key="blog" to="/blog" content="BLOG" />
      <NavigationItem
        key="login"
        to="/auth"
        show={!auth.isLoggedIn}
        content="LogIn"
      />
      <NavigationItem
        key="logout"
        type="button"
        onClick={auth.logout}
        show={auth.isLoggedIn}
        content="LogOut"
      />
    </ul>
  );
}

export default NavigationItems;
