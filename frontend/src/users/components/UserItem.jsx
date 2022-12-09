import React from "react";
import Avatar from "../../shared/components/UI/Avatar";

//CSS
import classes from "./UserItem.module.css";

function UserItem() {
  return (
    <div className={classes["user-item__image"]}>
      <Avatar
        image={
          "https://media.gq.com.tw/photos/6239445a7e6557df4af61f16/1:1/w_1600%2Cc_limit/site.jpg"
        }
        alt="beauty"
      />
    </div>
  );
}

export default UserItem;
