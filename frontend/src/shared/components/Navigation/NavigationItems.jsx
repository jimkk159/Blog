import React, { useCallback, useState } from "react";

//CSS
import classes from "./NavigationItems.module.css";

//CUSTOM
import NavigationItem from "./NavigationItem";

function NavigationItems(props) {
  const [authState, setAuthState] = useState(true);

  const authSubmitHandler = useCallback((event) => {
    console.log("I got click");
    setAuthState(false);
  }, []);

  return (
    <ul className={classes["nav-links"]}>
      <NavigationItem key="home" to="/" element="HOME" />
      <NavigationItem key="about" to="/about" element="ABOUT" />
      <NavigationItem key="blog" to="/blog" element="BLOG" />
      <NavigationItem
        key="login"
        to="/auth"
        show={!authState}
        element="LogIn"
      />
      <NavigationItem
        key="logout"
        type="button"
        onClick={authSubmitHandler}
        show={authState}
        element="LogOut"
      />
    </ul>
  );
}

export default NavigationItems;
