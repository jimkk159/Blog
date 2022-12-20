import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

//Icon
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";

//Image
import crossImage from "../../../../assets/img/x-symbol.png";

//Custom Context
import { AuthContext } from "../../../context/auth-context";
import { LanguageContext } from "../../../context/language-context";

//Custom Component
import NavigationItem from "../NavigationItem";
import UserAvatar from "../../../../users/components/UserAvatar";

//Custom Hook
import useUuid from "../../../hooks/uuid-hook";

//CSS
import classes from "./SideDrawerTitle.module.css";


function SideDrawerTitle(props) {
  const { language } = useContext(LanguageContext);
  const { isLoggedIn, logout } = useContext(AuthContext);

  //Redux
  const isDarkMode = useSelector((state) => state.theme.value);
  
  //React Router
  const navigate = useNavigate();

  //Custom Hook
  const uuidKeys = useUuid(3);

  //Auth
  const showAuth = () => {
    if (!isLoggedIn) {
      navigate("/auth", { state: { toLogin: true } });
      props.onCancel();
    }
  };
  return (
    <>
      <div
        className={`${classes["navigation__top_padding"]} ${
          isDarkMode ? classes["dark"] : classes["light"]
        }`}
      />
      <div
        className={`${classes["side-drawer__auth"]} ${
          isDarkMode ? classes["dark"] : classes["light"]
        }`}
        style={isLoggedIn ? { justifyContent: "space-between" } : null}
      >
        <UserAvatar
          className={
            isLoggedIn
              ? classes["side-drawer__avatar"]
              : classes["side-drawer__anonymous-avatar"]
          }
          isDarkMode={isDarkMode}
          onClick={showAuth}
        />
        <NavigationItem
          key={"sideDrawer-login_" + uuidKeys[0]}
          type="link"
          to="/auth"
          show={!isLoggedIn}
          content={language.login}
          className={`${classes["side-drawer__nav-link"]} ${classes["side-drawer__login"]}`}
          navInitialState={{ toLogin: true }}
          onClick={props.onCancel}
          icon={<LoginIcon />}
          iconClassName={classes["side-drawer__nav-icon"]}
        />
        <NavigationItem
          key={"sideDrawer-signup_" + uuidKeys[1]}
          type="link"
          to="/auth"
          show={!isLoggedIn}
          content={language.signup}
          className={`${classes["side-drawer__nav-link"]} ${classes["side-drawer__signup"]}`}
          navInitialState={{ toLogin: false }}
          onClick={props.onCancel}
          icon={<HistoryEduIcon />}
          iconClassName={classes["side-drawer__nav-icon"]}
        />
        <NavigationItem
          key={"sideDrawer-logout_" + uuidKeys[2]}
          type="button"
          onClick={logout}
          show={isLoggedIn}
          content={language.logout}
          className={`${classes["side-drawer__nav-link"]} ${classes["side-drawer__logout"]}`}
          icon={<LogoutIcon />}
          iconClassName={classes["side-drawer__nav-icon"]}
        />
        <div className={classes["side-drawer__cross"]} onClick={props.onCancel}>
          <img
            className={`${classes["cross-symbol"]}`}
            src={crossImage}
            alt="x-symbol"
          />
        </div>
      </div>
    </>
  );
}

export default SideDrawerTitle;
