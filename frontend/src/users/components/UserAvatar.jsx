import React from "react";
import Avatar from "../../shared/components/UI/Avatar";

//CSS
import classes from "./UserAvatar.module.css";

function UserAvatar(props) {
  return (
    <div
      className={`${classes["user-item__image"]} ${props.className}`}
      onClick={props.onClick}
    >
      <Avatar
        image={
          "https://media.gq.com.tw/photos/6239445a7e6557df4af61f16/1:1/w_1600%2Cc_limit/site.jpg"
        }
        alt="beauty"
      />
    </div>
  );
}

export default UserAvatar;
