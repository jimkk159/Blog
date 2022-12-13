import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

//Custom Context
import { AuthContext } from "../../context/auth-contex";

//Custom Component
import NavigationHeader from "./NavigationHeader";
import NavigationItems from "./NavigationItems";
import UserAvatar from "../../../users/components/UserAvatar";
import Languae from "./Laguage";
import Search from "./Search";
import Hamburger from "../UI/Hamburger";
import NavigationSideDrawer from "./NavigationSideDrawer/SideDrawer";
import AuthModal from "../../../users/components/AuthModal";

//Custom Hook
import useScroll from "../../hooks/scorll-hook";

//CSS
import classes from "./Navigation.module.css";

function Navigation(props) {
  const [isDrawer, setIsDrawer] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
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

  //Show Auth Modal
  const showAuth = () => {
    setShowModal(true);
  };

  return (
    <>
      {isDrawer && <NavigationSideDrawer onClick={closeDrawerHandler} />}
      {!isLoggedIn && showModal && (
        <AuthModal showModal={showModal} setShowModal={setShowModal} />
      )}
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
          <UserAvatar onClick={showAuth} />
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
