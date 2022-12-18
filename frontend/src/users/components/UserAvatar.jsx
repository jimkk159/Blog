import React, { useContext } from "react";
import { CSSTransition } from "react-transition-group";

//Image
import anonymousUser from "../../assets/img/anonymous_user.png";

//Custom Context
import { AuthContext } from "../../shared/context/auth-context";
import { ThemeContext } from "../../shared/context/theme-context";

//Custom Component
import Avatar from "../../shared/components/UI/Avatar";

//CSS
import classes from "./UserAvatar.module.css";

function UserAvatar(props) {
  const auth = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  const userImage =
    "https://media.gq.com.tw/photos/6239445a7e6557df4af61f16/1:1/w_1600%2Cc_limit/site.jpg";
  return (
    <div className={`${classes.container} ${props.className}`}>
      <div className={classes["open-up"]}></div>
      <div className={`${classes["user-avatar"]}`} onClick={props.onClick}>
        <Avatar
          className={classes["user-img"]}
          image={anonymousUser}
          alt="beauty"
        />
        <CSSTransition
          in={auth.isLoggedIn}
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
              isDarkMode ? classes["avatar-dark"] : classes["avatar-light"]
            }`}
            image={userImage}
            alt="beauty"
          />
        </CSSTransition>
      </div>
    </div>
  );
}

export default UserAvatar;
