import React from "react";

//CSS
import classes from "./SideDrawerTitle.module.css";

//Custom Component
import UserItem from "../../../../users/components/UserItem";

//Image
import crossImage from "../../../../img/x-symbol.png"

function SideDrawerTitle(props) {
  return (
    <>
      <div className={classes.navigation__drawer__title}>
        <div className={classes.navigation__top_padding} />
        <div className={classes.navigation__drawer__auth}>
          <UserItem className={classes.navigation__drawer__avatar} />
          <div className={classes.navigation__drawer__padding}></div>
          <h1>Login</h1>
          <h1>Sign Up</h1>
          <div
            className={classes.navigation__drawer__cross}
            onClick={props.onCancel}
          >
          <img className={`${classes["cross-symbol"]}`} src={crossImage} alt="x-symbol"/>
          </div>
        </div>
      </div>
    </>
  );
}

export default SideDrawerTitle;
