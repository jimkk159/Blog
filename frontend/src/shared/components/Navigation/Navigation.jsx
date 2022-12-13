import React, { useState } from "react";
import { Link } from "react-router-dom";

//CSS
import classes from "./Navigation.module.css";

//Custom Component
import NavigationHeader from "./NavigationHeader";
import NavigationItems from "./NavigationItems";
import UserItem from "../../../users/components/UserItem";
import Languae from "./Laguage";
import Search from "./Search";
import Hamburger from "../UI/Hamburger";
import NavigationSideDrawer from "./NavigationSideDrawer/SideDrawer";

//Custom Hook
import useScroll from "../../hooks/scorll-hook";

function Navigation(props) {
  const [isDrawer, setIsDrawer] = useState(false);

  const { scrollPosition, isScrollingUp } = useScroll();

  //If Scroll Position less than 40 pixel or Scroll up then...
  const showNavItems = scrollPosition < 40 || isScrollingUp;

  //SideDrawer control
  const openDrawerHandler = () => {
    setIsDrawer(true);
  };

  const closeDrawerHandler = () => {
    setIsDrawer(false);
  };

  return (
    <>
      {isDrawer && <NavigationSideDrawer onClick={closeDrawerHandler}/>}
      <NavigationHeader>
        <div className={classes.navigation__title}>
          <Hamburger onClick={openDrawerHandler} />
          <h1 className={classes.navigation__icon}>
            <Link to="/">Blog</Link>
          </h1>
          <Search className={classes["navigation__search"]} />
          <Languae className={classes["navigation__pc__language"]}>
            EN/CH
          </Languae>
          <UserItem />
        </div>
        <hr />
        {showNavItems && (
          <>
            <nav className={classes["navigation__pc__nav-items"]}>
              <NavigationItems />
            </nav>
            <hr className={classes["navigation__pc__nav-items"]} />
          </>
        )}
      </NavigationHeader>
    </>
  );
}

export default Navigation;
