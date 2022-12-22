import React from "react";
import { AiOutlineEdit, AiFillDelete } from "react-icons/ai";

//Custom Component
import Pin from "../../shared/components/Icons/Pin";

//CSS
import classes from "./PostInfo.module.css";

function PostInfo(props) {
  const editHandler = () => {
    console.log("edit");
  };
  const deleteHandler = () => {
    console.log("delete");
  };
  return (
    <>
      <p className={classes["statement"]}>Created by&nbsp;&nbsp;</p>
      <p className={classes["author"]}>{props.author}&nbsp;&nbsp;</p>
      <p className={classes["statement"]}>on {props.date}&nbsp;&nbsp;</p>
      <Pin
        className={`${classes["pin"]} ${
          !props.isDarkMode && classes["light-pin"]
        }`}
        isPined={props.isPined}
        isAdmin={props.isAdmin}
        onToggle={null}
      />
      <AiOutlineEdit
        className={`${classes["icon"]} ${
          !props.isDarkMode && classes["light-pencil"]
        }`}
        onClick={editHandler}
      />
      <AiFillDelete
        className={`${classes["icon"]} ${
          !props.isDarkMode && classes["light-trash-can"]
        }`}
        onClick={deleteHandler}
      />
    </>
  );
}

export default PostInfo;
