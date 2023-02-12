import React from "react";
import { CSSTransition } from "react-transition-group";

//Custom Component
import Avatar from "../../shared/components/UI/Avatar";

//CSS
import classes from "./UserAvatar.module.css";

function UserAvatar(props) {
  const avatar = props.isAnimate ? (
    <CSSTransition
      in={props.show}
      timeout={{ enter: 2000, exit: 0 }}
      classNames={{
        enter: classes["user-img-enter"],
        enterActive: classes["user-img-enter-active"],
        // exit: classes["user-img-exit"],
        // exitActive: classes["user-img-exit-active"],
      }}
      mountOnEnter
      unmountOnExit
    >
      <Avatar
        className={`${classes["user-img"]} ${
          props.isDarkMode ? classes["avatar-dark"] : classes["avatar-light"]
        }`}
        image={props.img}
        alt="user-avatar"
      />
    </CSSTransition>
  ) : (
    <Avatar
      className={`${classes["user-img"]} ${
        props.isDarkMode ? classes["avatar-dark"] : classes["avatar-light"]
      }`}
      image={props.img}
      alt="user-avatar"
    />
  );

  return (
    <div className={`${classes.container} ${props.className}`}>
      <div className={classes["open-up"]}></div>
      <div className={`${classes["user-avatar"]}`} onClick={props.onClick}>
        <Avatar
          className={`${classes["user-img"]} ${
            props.isDarkMode ? classes["avatar-dark"] : classes["avatar-light"]
          }`}
          image={props.defaultImg}
          alt="default-avatar"
        />
        {avatar}
      </div>
    </div>
  );
}

export default UserAvatar;

//reference:https://stackoverflow.com/questions/5445491/height-equal-to-dynamic-width-css-fluid-layout
