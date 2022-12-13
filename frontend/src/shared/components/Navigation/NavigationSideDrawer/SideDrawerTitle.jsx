import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

//CSS
import classes from "./SideDrawerTitle.module.css";

//Image
import crossImage from "../../../../img/x-symbol.png";

//Custom Context
import { AuthContext } from "../../../context/auth-contex";

//Custom Component
import NavigationItem from "../NavigationItem";
import UserAvatar from "../../../../users/components/UserAvatar";

function SideDrawerTitle(props) {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const showAuth = () => {
    navigate("/auth");
    props.onCancel();
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
            key="sideDrawer-login"
            type="link"
            to="/auth"
            show={!auth.isLoggedIn}
            content="LogIn"
            className={`${classes["side-drawer__nav-link"]} ${classes["side-drawer__login"]}`}
            onClick={props.onCancel}
          />
          <NavigationItem
            key="sideDrawer-login"
            type="link"
            to="/auth"
            show={!auth.isLoggedIn}
            content="Signup"
            className={`${classes["side-drawer__nav-link"]} ${classes["side-drawer__signup"]}`}
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
