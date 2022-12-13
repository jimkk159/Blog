import React, { useContext } from "react";

//Custom Context
import { AuthContext } from "../../context/auth-contex";

//Custom Component
import NavigationItem from "./NavigationItem";

//Custom Hook
import useUuid from "../../hooks/uuid-hook";

//CSS
import classes from "./NavigationItems.module.css";

function NavigationItems(props) {
  const auth = useContext(AuthContext);
  const uuidKeys = useUuid(5);
  return (
    <ul className={classes["nav-links"]}>
      <NavigationItem key={"home_"+uuidKeys[0]} to="/" content="HOME" />
      <NavigationItem key={"about_"+uuidKeys[1]} to="/about" content="ABOUT" />
      <NavigationItem key={"blog_"+uuidKeys[2]} to="/blog" content="BLOG" />
      <NavigationItem
        key={"login_"+uuidKeys[3]}
        to="/auth"
        show={!auth.isLoggedIn}
        content="LogIn"
      />
      <NavigationItem
        key={"logout_"+uuidKeys[4]}
        type="button"
        onClick={auth.logout}
        show={auth.isLoggedIn}
        content="LogOut"
      />
    </ul>
  );
}

export default NavigationItems;
