import React from "react";
import { useSelector } from "react-redux";

//Icon
import { AiOutlineEdit, AiFillDelete } from "react-icons/ai";

//Custom Component
import Pin from "../../../shared/components/Icons/Pin";

//CSS
import classes from "./PostInfoTitle.module.css";

function PostInfoTitle(props) {
  const isDarkMode = useSelector((state) => state.theme.value);
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
    <div className={classes["container"]}>
      <p className={classes["statement"]}>Created by&nbsp;&nbsp;</p>
      <p className={classes["author"]}>{props.author}&nbsp;&nbsp;</p>
      <p className={classes["statement"]}>on {props.date}&nbsp;&nbsp;</p>
      <Pin
        className={`${classes["pin"]} ${!isDarkMode && classes["light-pin"]}`}
        isPined={props.isPined}
        isAdmin={props.isAdmin}
        onToggle={togglePinedHandler}
      />
      <AiOutlineEdit
        className={`${classes["icon"]} ${
          !isDarkMode && classes["light-pencil"]
        }`}
        onClick={editHandler}
      />
      <AiFillDelete
        className={`${classes["icon"]} ${
          !isDarkMode && classes["light-trash-can"]
        }`}
        onClick={deleteHandler}
      />
    </div>
  );
}

export default PostInfoTitle;
