import React from "react";
import { CSSTransition } from "react-transition-group";

//Custom Component
import Avatar from "../../shared/components/UI/Avatar";

//CSS
import classes from "./UserAvatar.module.css";

function UserAvatar(props) {
 return (
    <div className={`${classes.container} ${props.className}`}>
      <div className={classes["open-up"]}></div>
      <div className={`${classes["user-avatar"]}`} onClick={props.onClick}>
        <Avatar
          className={classes["user-img"]}
          image={props.defaultImg}
          alt="default-avatar"
        />
        <CSSTransition
          in={props.show}
          timeout={{ enter: 2000, exit: 2000 }}
          classNames={{
            enter: classes["user-img-enter"],
            enterActive: classes["user-img-enter-active"],
            exit: classes["user-img-exit"],
            exitActive: classes["user-img-exit-active"],
          }}
          mountOnEnter
          unmountOnExit
        >
          <Avatar
            className={`${classes["user-img"]} ${
              props.isDarkMode
                ? classes["avatar-dark"]
                : classes["avatar-light"]
            }`}
            image={props.img}
            alt="user-avatar"
          />
        </CSSTransition>
      </div>
    </div>
  );
}

export default UserAvatar;

//reference:https://stackoverflow.com/questions/5445491/height-equal-to-dynamic-width-css-fluid-layout
