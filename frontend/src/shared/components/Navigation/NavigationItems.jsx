import React from "react";


//CSS
import classes from "./NavigationItems.module.css";

//Custom Components
import NavigationItem from "./NavigationItem";
import Search from "./Search";

function NavigationItems(props) {
  return (
    <ul className={classes["nav-links"]}>
      <NavigationItem key="home" to="">HOME</NavigationItem>
      <NavigationItem key="about" to="">ABOUT</NavigationItem>
      <NavigationItem key="blog" to="">BLOG</NavigationItem>
      <NavigationItem key="auth" type="button" onClick={null}>
        LogIn
      </NavigationItem>
      <Search />
    </ul>
  );
}

export default NavigationItems;
