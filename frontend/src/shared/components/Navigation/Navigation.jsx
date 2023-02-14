import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//Image
import anonymousUser from "../../../assets/img/anonymous_user.png";

//Redux Slice
import { themeActions } from "../../../store/theme-slice";
import { languageActions } from "../../../store/language-slice";

//Custom Component
import Theme from "../UI/Theme";
import Search from "../UI/Search";
import Languae from "../UI/Laguage";
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

  //Redux
  const isDarkMode = useSelector((state) => state.theme.value);
  const { avatar, isLoggedIn } = useSelector((state) => state.auth);
  const { isSetted, isEnglish, language } = useSelector(
    (state) => state.language
  );
  const dispatch = useDispatch();

  const userAvatar = avatar
    ? avatar.startsWith("https://") ||
      avatar.startsWith("http://") ||
      avatar.startsWith("data:image")
      ? `${avatar}`
      : `${process.env.REACT_APP_BACKEND_URL}/${avatar}`
    : null;

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

  //Window Size Change
  useEffect(() => {
    setIsDrawer(false);
  }, []);

  //Localization
  useEffect(() => {
    const userLanguae = navigator.language || navigator.userLanguae;
    if (isSetted) return;
    if (userLanguae === "zh-TW" || userLanguae === "zh-CH") {
      dispatch(languageActions.setChinese());
    } else {
      dispatch(languageActions.setEnglish());
    }
  }, [dispatch, isSetted]);

  return (
    <>
      <NavigationSideDrawer onClick={closeDrawerHandler} show={isDrawer} />
      <AuthModal
        show={!isLoggedIn && showModal && matches}
        setShowModal={setShowModal}
        isAnimate
      />
      <NavigationHeader>
        <div className={classes.navigation__title}>
          <Hamburger onClick={openDrawerHandler} isDarkMode={isDarkMode} />
          <h1 className={classes.navigation__icon}>
            <Link to="/">Blog</Link>
          </h1>
          <Search
            className={`${classes["navigation__search"]} ${classes["navigation__search-input"]}`}
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
            onToggle={() => {
              dispatch(languageActions.toggle());
            }}
            isDarkMode={isDarkMode}
          >
            <p>EN</p>
            <p className={classes.ch}>CH</p>
          </Languae>
          {matches && (
            <UserAvatar
              show={isLoggedIn}
              defaultImg={anonymousUser}
              isDarkMode={isDarkMode}
              onClick={showAuthHandler}
              img={userAvatar}
              isAnimate
            />
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
