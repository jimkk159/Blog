import React from "react";

//CSS
import classes from "./Navigation.module.css";

//Custom component
import NavigationHeader from "./NavigationHeader";
import NavigationItems from "./NavigationItems";

function Navigation(props) {
  return (
    <>
      <NavigationHeader>
        <h1 className={classes.navigation__title}>Blog</h1>
        <nav>
          <NavigationItems />
        </nav>
      </NavigationHeader>
    </>
  );
}

export default Navigation;
