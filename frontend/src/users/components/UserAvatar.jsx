import React, { useContext } from "react";
import Avatar from "../../shared/components/UI/Avatar";

//Image
import anonymousUser from "../../img/anonymous_user.png";

//Custom Context
import { AuthContext } from "../../shared/context/auth-contex";

//CSS
import classes from "./UserAvatar.module.css";

function UserAvatar(props) {
  const auth = useContext(AuthContext);
  const userImage = auth.isLoggedIn
    ? "https://media.gq.com.tw/photos/6239445a7e6557df4af61f16/1:1/w_1600%2Cc_limit/site.jpg"
    : anonymousUser;
  return (
    <div
      className={`${classes["user-item__image"]} ${props.className}`}
      onClick={props.onClick}
    >
      <Avatar image={userImage} alt="beauty" />
    </div>
  );
}

export default UserAvatar;
