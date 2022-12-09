import React from "react";
import { Link } from "react-router-dom";

//CSS
import classes from "./Navigation.module.css";

//CUSTOM
import NavigationHeader from "./NavigationHeader";
import NavigationItems from "./NavigationItems";
import UserItem from "../../../users/components/UserItem";
import Languae from "./Laguage";
import Search from "./Search";

function Navigation(props) {
  return (
    <>
      <NavigationHeader>
        <div className={classes.navigation__title}>
          <h1 className={classes.navigation__icon}>
            <Link to="/">Blog</Link>
          </h1>
          <Search className={classes["navigation__search"]}/>
          <Languae className={classes["navigation__pc__btn"]}>EN/CH</Languae>
          <UserItem />
        </div>
        <hr />
        <nav className={classes["navigation__pc__nav-items"]}>
          <NavigationItems />
        </nav>
      </NavigationHeader>
    </>
  );
}

export default Navigation;
