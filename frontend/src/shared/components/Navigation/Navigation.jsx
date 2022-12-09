import React from "react";
import { Link } from "react-router-dom";

//CSS
import classes from "./Navigation.module.css";

//CUSTOM
import NavigationHeader from "./NavigationHeader";
import NavigationItems from "./NavigationItems";

function Navigation(props) {
  return (
    <>
      <NavigationHeader>
        <h1 className={classes.navigation__title}>
          <Link to="/">Blog</Link>
        </h1>
        <nav>
          <NavigationItems />
        </nav>
      </NavigationHeader>
    </>
  );
}

export default Navigation;
