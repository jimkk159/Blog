import React from "react";

//CSS
import classes from "./NavigationItems.module.css";

//CUSTOM
import NavigationItem from "./NavigationItem";
import Search from "./Search";

function NavigationItems(props) {
  // const authSubmitHandler = (event) => {
  //   event.target && event.target.active();
  //   console.log('I got click');
  // };
  return (
    <ul className={classes["nav-links"]}>
      <NavigationItem key="home" to="/">
        HOME
      </NavigationItem>
      <NavigationItem key="about" to="/about">
        ABOUT
      </NavigationItem>
      <NavigationItem key="blog" to="/blog">
        BLOG
      </NavigationItem>
      <NavigationItem key="auth" type="button" onClick={authSubmitHandler}>
        LogIn
      </NavigationItem>
      <Search />
    </ul>
  );
}

export default NavigationItems;
