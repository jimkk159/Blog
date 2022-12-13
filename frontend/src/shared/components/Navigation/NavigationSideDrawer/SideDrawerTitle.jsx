import React, { useContext } from "react";

//CSS
import classes from "./SideDrawerTitle.module.css";

//Image
import crossImage from "../../../../img/x-symbol.png";

//Custom Context
import { AuthContext } from "../../../context/auth-contex";

//Custom Component
import NavigationItem from "../NavigationItem";
import UserItem from "../../../../users/components/UserItem";

function SideDrawerTitle(props) {
  const auth = useContext(AuthContext);
  return (
    <>
      <div className={classes["side-drawer__title"]}>
        <div className={classes["navigation__top_padding"]} />
        <div className={classes["side-drawer__auth"]}>
          <UserItem className={classes["side-drawer__avatar"]} />
          <div className={classes["side-drawer__padding"]}></div>

          <NavigationItem
            key="sideDrawer-login"
            type="link"
            to="/auth"
            show={!auth.isLoggedIn}
            content="LogIn"
            className={`${classes["side-drawer__nav-link"]} ${classes["side-drawer__login"]}`}
          />
          <NavigationItem
            key="sideDrawer-login"
            type="link"
            to="/sign-up"
            show={!auth.isLoggedIn}
            content="Signup"
            className={`${classes["side-drawer__nav-link"]} ${classes["side-drawer__signup"]}`}
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
