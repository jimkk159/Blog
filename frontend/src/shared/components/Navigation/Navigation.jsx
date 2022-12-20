import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//Custom Context
import { AuthContext } from "../../context/auth-context";
import { LanguageContext } from "../../context/language-context";

//Redux Slice
import { themeActions } from "../../../store/theme-slice";

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
  const { isEnglish, language, toggleLanguage } = useContext(LanguageContext);

  //Redux
  const isDarkMode = useSelector((state) => state.theme.value);
  const dispatch = useDispatch();

  //React Router
  const navigate = useNavigate();

  //CustomHook
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

      <NavigationHeader isDarkMode={isDarkMode}>
        <div className={classes.navigation__title}>
          <Hamburger onClick={openDrawerHandler} isDarkMode={isDarkMode} />
          <h1 className={classes.navigation__icon}>
            <Link to="/">Blog</Link>
          </h1>
          <Search
            className={`${classes["navigation__search"]} ${classes["navigation__search-input"]}`}
            onToggle={toggleSearchHandler}
            onCancel={closeSearchHandler}
            showSearch={isSearch}
            isDarkMode={isDarkMode}
          />
          <Theme
            className={classes["navigation__theme"]}
            isDarkMode={isDarkMode}
            onSwitch={() => {
              dispatch(themeActions.toggle());
            }}
          >
            {isDarkMode ? language.darkMode : language.normalMode}
          </Theme>
          <Languae
            className={classes["navigation__pc__language"]}
            show={isEnglish}
            onToggle={toggleLanguage}
            isDarkMode={isDarkMode}
          >
            <p>EN</p>
            <p className={classes.ch}>CH</p>
          </Languae>
          {matches && (
            <UserAvatar onClick={showAuthHandler} isDarkMode={isDarkMode} />
          )}
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
