import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

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
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const uuidKeys = useUuid(2);

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
        <div className={classes["side-drawer__auth"]}>
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
          />
          <div
            className={classes["side-drawer__cross"]}
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
