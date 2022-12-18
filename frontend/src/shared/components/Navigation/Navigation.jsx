import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

//Custom Context
import { AuthContext } from "../../context/auth-context";
import { ThemeContext } from "../../context/theme-context";
import { LanguageContext } from "../../context/language-context";

//Custom Component
import Theme from "./Theme";
import Search from "./Search";
import Languae from "./Laguage";
import NavigationHeader from "./NavigationHeader";
import NavigationItems from "./NavigationItems";
import Hamburger from "../UI/Hamburger";
import NavigationSideDrawer from "./NavigationSideDrawer/SideDrawer";
import AuthModal from "../../../users/components/AuthModal";
import UserAvatar from "../../../users/components/UserAvatar";

//Custom Hook
import useScroll from "../../hooks/scorll-hook";
import useMediaQuery from "../../hooks/media-query-hook";

//CSS
import classes from "./Navigation.module.css";

function Navigation(props) {
  const [isDrawer, setIsDrawer] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  const { isEnglish, language, toggleLanguage } = useContext(LanguageContext);
  const navigate = useNavigate();
  const { scrollPosition, isScrollingUp } = useScroll();
  const { matches } = useMediaQuery("min", "768");

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
  const showAuthHandler = () => {
    if (!isLoggedIn) {
      setShowModal(true);
    }
  };

  //Show Search Bar
  const toggleSearchHandler = () => {
    setIsSearch((prev) => !prev);
  };

  const closeSearchHandler = () => {
    setIsSearch(false);
  };

  //Window Size Change
  useEffect(() => {
    setIsDrawer(false);
  }, [matches, navigate]);

  return (
    <>
      <NavigationSideDrawer onClick={closeDrawerHandler} show={isDrawer} />

      <AuthModal
        show={!isLoggedIn && showModal && matches}
        setShowModal={setShowModal}
      />

      <NavigationHeader>
        <div className={classes.navigation__title}>
          <Hamburger onClick={openDrawerHandler} />
          <h1 className={classes.navigation__icon}>
            <Link to="/">Blog</Link>
          </h1>
          <Search
            className={`${classes["navigation__search"]} ${classes["navigation__search-input"]}`}
            onToggle={toggleSearchHandler}
            onCancel={closeSearchHandler}
            showSearch={isSearch}
          />
          <Theme className={classes["navigation__theme"]}>
            {isDarkMode ? language.darkMode : language.normalMode}
          </Theme>
          <Languae
            className={classes["navigation__pc__language"]}
            show={isEnglish}
            onToggle={toggleLanguage}
          >
            <p>EN</p>
            <p className={classes.ch}>CH</p>
          </Languae>
          {matches && <UserAvatar onClick={showAuthHandler} />}
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
