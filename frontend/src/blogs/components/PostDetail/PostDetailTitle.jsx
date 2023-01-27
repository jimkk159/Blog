import React from "react";

//Image
import anonymousUser from "../../../assets/img/anonymous_user.png";

//Icon
import { AiOutlineEdit, AiFillDelete } from "react-icons/ai";

//Custom Comonent
import Pin from "../../../shared/components/Icons/Pin";
import UserAvatar from "../../../users/components/UserAvatar";

//CSS
import classes from "./PostDetailTitle.module.css";

function PostDetailTitle(props) {
  const { title, date, author, isPined, isDarkMode, isAdmin } = props;
  const editHandler = (event) => {
    event.stopPropagation();
    console.log("edit");
  };
  const deleteHandler = (event) => {
    event.stopPropagation();
    console.log("delete");
  };
  const togglePinedHandler = (event) => {
    event.stopPropagation();
    console.log("toggle pinned!");
  };
  return (
    <>
      <h1 className={classes["title"]}>{title}</h1>
      <div className={classes["container"]}>
        <div className={`${classes["flex-container"]} ${classes["flex-end"]}`}>
          <div
            className={`${classes["flex-container"]} ${classes["icon-left"]}`}
          >
            <AiOutlineEdit
              className={`${classes["icon"]} ${classes["edit"]} ${
                !isDarkMode && classes["light-pencil"]
              }`}
              onClick={editHandler}
            />
            <AiFillDelete
              className={`${classes["icon"]} ${classes["delete"]} ${
                !isDarkMode && classes["light-trash-can"]
              }`}
              onClick={deleteHandler}
            />
            <Pin
              className={`${classes["icon"]} ${classes["pin"]} ${
                !isDarkMode && classes["light-pin"]
              }`}
              show={isAdmin}
              isPined={isPined}
              isAdmin={isAdmin}
              onToggle={togglePinedHandler}
            />
          </div>
          <div
            className={`${classes["flex-container"]} ${classes["direction-coloum"]} ${classes["flex-end"]}`}
          >
            <div>
              <p className={classes["statement"]}>Created by&nbsp;&nbsp;</p>
              <p className={classes["author"]}>{author}&nbsp;&nbsp;</p>
            </div>
            <div>
              <p className={classes["statement"]}>on {date}&nbsp;&nbsp;</p>
            </div>
          </div>
          <UserAvatar
            show={false}
            defaultImg={anonymousUser}
            className={`${classes["avatar"]}`}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
      <hr className={classes["title-hr"]} />
    </>
  );
}

export default PostDetailTitle;
