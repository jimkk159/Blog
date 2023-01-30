import React from "react";
import { useSelector } from "react-redux";

//Icon
import { AiOutlineEdit, AiFillDelete } from "react-icons/ai";

//Custom Component
import Pin from "../../../shared/components/Icons/Pin";

//CSS
import classes from "./PostInfoTitle.module.css";

function PostInfoTitle(props) {
  //Redux
  const { userId, isAdmin } = useSelector((state) => state.auth);
  const isDarkMode = useSelector((state) => state.theme.value);

  //Toggle Pinned
  const togglePinedHandler = (event) => {
    event.stopPropagation();
    console.log("toggle pinned!");
  };

  let pinContent;
  pinContent = (
    <Pin
      show={true}
      className={`${classes["pin"]} ${!isDarkMode && classes["light-pin"]}`}
      isPined={props.isPined}
      isAdmin={isAdmin}
      onToggle={togglePinedHandler}
    />
  );

  let content;
  if (props.authorId === userId) {
    content = (
      <>
        <AiOutlineEdit
          className={`${classes["icon"]} ${
            !isDarkMode && classes["light-pencil"]
          }`}
          onClick={props.onEdit}
        />
        <AiFillDelete
          className={`${classes["icon"]} ${
            !isDarkMode && classes["light-trash-can"]
          }`}
          onClick={props.onShowDelete}
        />
      </>
    );
  }

  return (
    <div className={classes["container"]}>
      <p className={classes["statement"]}>Created by&nbsp;&nbsp;</p>
      <p className={classes["author"]}>{props.authorName}&nbsp;&nbsp;</p>
      <p className={classes["statement"]}>on {props.date}&nbsp;&nbsp;</p>
      {pinContent}
      {content}
    </div>
  );
}

export default PostInfoTitle;
