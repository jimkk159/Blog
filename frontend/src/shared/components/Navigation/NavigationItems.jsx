import React, { useContext } from "react";

//CSS
import classes from "./NavigationItems.module.css";

//Custom Component
import NavigationItem from "./NavigationItem";
import { AuthContext } from "../../context/auth-contex";

function NavigationItems(props) {
  const auth = useContext(AuthContext);

  return (
    <ul className={classes["nav-links"]}>
      <NavigationItem key="home" to="/" element="HOME" />
      <NavigationItem key="about" to="/about" element="ABOUT" />
      <NavigationItem key="blog" to="/blog" element="BLOG" />
      <NavigationItem
        key="login"
        to="/auth"
        show={!auth.isLoggedIn}
        element="LogIn"
      />
      <NavigationItem
        key="logout"
        type="button"
        onClick={auth.logout}
        show={auth.isLoggedIn}
        element="LogOut"
      />
    </ul>
  );
}

export default NavigationItems;
