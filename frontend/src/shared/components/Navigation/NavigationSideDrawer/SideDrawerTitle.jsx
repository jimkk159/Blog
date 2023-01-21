import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//Icon
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";

//Image
import crossImage from "../../../../assets/img/x-symbol.png";
import anonymousUser from "../../../../assets/img/anonymous_user.png";

//Redux Thunk
import { logoutAuto } from "../../../../store/auth-thunk";

//Custom Component
import NavigationItem from "../NavigationItem";
import UserAvatar from "../../../../users/components/UserAvatar";

//Custom Hook
import useUuid from "../../../hooks/uuid-hook";

//CSS
import classes from "./SideDrawerTitle.module.css";

function SideDrawerTitle(props) {
  //Redux
  const isDarkMode = useSelector((state) => state.theme.value);
  const { avatar, isLoggedIn } = useSelector((state) => state.auth);
  const language = useSelector((state) => state.language.language);
  const dispatch = useDispatch();

  //React Router
  const navigate = useNavigate();

  //Custom Hook
  const uuidKeys = useUuid(3);

  //Auth
  const showAuthHandler = () => {
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
          show={isLoggedIn}
          className={
            isLoggedIn
              ? classes["side-drawer__avatar"]
              : classes["side-drawer__anonymous-avatar"]
          }
          defaultImg={anonymousUser}
          isDarkMode={isDarkMode}
          onClick={showAuthHandler}
          img={`${process.env.REACT_APP_BACKEND_URL}/${avatar}`}
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
          onClick={() => {
            dispatch(logoutAuto());
          }}
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
