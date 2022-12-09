import React from "react";
import { Link } from "react-router-dom";

//CSS
import classes from "./Navigation.module.css";

//CUSTOM
import NavigationHeader from "./NavigationHeader";
import NavigationItems from "./NavigationItems";
import UserItem from "../../../users/components/UserItem";
import Languae from "./Laguage";

function Navigation(props) {
  return (
    <>
      <NavigationHeader>
        <h1 className={classes.navigation__icon}>
          <Link to="/">Blog</Link>
        </h1>
        <nav className={classes["navigation__pc__nav-items"]}>
          <NavigationItems />
        </nav>
        <Languae className={classes["navigation__pc__btn"]}>EN/CH</Languae>
        <UserItem />
      </NavigationHeader>
    </>
  );
}

export default Navigation;
