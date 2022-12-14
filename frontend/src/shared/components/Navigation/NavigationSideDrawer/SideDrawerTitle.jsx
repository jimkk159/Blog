import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

//Icon
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

//Image
import crossImage from "../../../../img/x-symbol.png";

//Custom Context
import { AuthContext } from "../../../context/auth-contex";

//Custom Component
import NavigationItem from "../NavigationItem";
import UserAvatar from "../../../../users/components/UserAvatar";

//Custom Hook
import useUuid from "../../../hooks/uuid-hook";

//CSS
import classes from "./SideDrawerTitle.module.css";

function SideDrawerTitle(props) {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
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
      <div className={classes["side-drawer__title"]}>
        <div className={classes["navigation__top_padding"]} />
        <div
          className={classes["side-drawer__auth"]}
          style={isLoggedIn ? { justifyContent: "space-between" } : null}
        >
          <UserAvatar
            className={classes["side-drawer__avatar"]}
            onClick={showAuth}
          />
          <div className={classes["side-drawer__padding"]}></div>

          <NavigationItem
            key={"sideDrawer-login_" + uuidKeys[0]}
            type="link"
            to="/auth"
            show={!isLoggedIn}
            content="LogIn"
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
            content="Signup"
            className={`${classes["side-drawer__nav-link"]} ${classes["side-drawer__signup"]}`}
            navInitialState={{ toLogin: false }}
            onClick={props.onCancel}
            icon={<LogoutIcon />}
            iconClassName={classes["side-drawer__nav-icon"]}
          />
          <NavigationItem
            key={"sideDrawer-logout_" + uuidKeys[2]}
            type="button"
            onClick={logout}
            show={isLoggedIn}
            content="LogOut"
            className={`${classes["side-drawer__nav-link"]} ${classes["side-drawer__logout"]}`}
            icon={<LogoutIcon />}
            iconClassName={classes["side-drawer__nav-icon"]}
          />
          <div
            className={classes["side-drawer__cross"]}
            style={isLoggedIn ? { flex: 1 } : { flex: 2 }}
            onClick={props.onCancel}
          >
            <img
              className={`${classes["cross-symbol"]}`}
              src={crossImage}
              alt="x-symbol"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default SideDrawerTitle;
