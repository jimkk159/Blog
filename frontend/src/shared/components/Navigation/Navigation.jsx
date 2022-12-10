import React from "react";
import { Link } from "react-router-dom";

//CSS
import classes from "./Navigation.module.css";

//CUSTOM Component
import NavigationHeader from "./NavigationHeader";
import NavigationItems from "./NavigationItems";
import UserItem from "../../../users/components/UserItem";
import Languae from "./Laguage";
import Search from "./Search";

//Custom Hook
import useScroll from "../../hooks/scorll-hook";

function Navigation(props) {
  const { scrollPosition, isScrollingUp } = useScroll();
  const showNavItems = scrollPosition < 40 || isScrollingUp;
  return (
    <>
      <NavigationHeader>
        <div className={classes.navigation__title}>
          <h1 className={classes.navigation__icon}>
            <Link to="/">Blog</Link>
          </h1>
          <Search className={classes["navigation__search"]} />
          <Languae className={classes["navigation__pc__btn"]}>EN/CH</Languae>
          <UserItem />
        </div>
        <hr />
        {showNavItems && (
          <>
            <nav className={classes["navigation__pc__nav-items"]}>
              <NavigationItems />
            </nav>
            <hr />
          </>
        )}
      </NavigationHeader>
    </>
  );
}

export default Navigation;
