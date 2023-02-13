import React from "react";
import { useSelector } from "react-redux";

//Icon
import { AiOutlineEdit, AiFillDelete } from "react-icons/ai";

//Custom Component
import Pin from "../../../shared/components/Icons/Pin";

//CSS
import classes from "./PostInfoTitle.module.css";

function PostInfoTitle({
  author,
  date,
  authorId,
  postId,
  isPined,
  onEdit,
  onShowDelete,
}) {
  //Redux
  const { uid, isAdmin, token } = useSelector((state) => state.auth);
  const isDarkMode = useSelector((state) => state.theme.value);
  let pinContent;
  pinContent = (
    <Pin
      show={true}
      postId={postId}
      token={token}
      className={`${classes["pin"]} ${!isDarkMode && classes["light-pin"]}`}
      isPined={isPined}
      isAdmin={isAdmin}
      isDarkMode={isDarkMode}
    />
  );

  let editContent;
  if (authorId === uid) {
    editContent = (
      <AiOutlineEdit
        className={`${classes["icon"]} ${
          !isDarkMode && classes["light-pencil"]
        }`}
        onClick={onEdit}
      />
    );
  }

  let deleteContent;
  if (isAdmin || authorId === uid) {
    deleteContent = (
      <AiFillDelete
        className={`${classes["icon"]} ${
          !isDarkMode && classes["light-trash-can"]
        }`}
        onClick={onShowDelete}
      />
    );
  }

  return (
    <div className={classes["container"]}>
      <p className={classes["statement"]}>Created by&nbsp;&nbsp;</p>
      <p className={classes["author"]}>{author}&nbsp;&nbsp;</p>
      <p className={classes["statement"]}>on {date}&nbsp;&nbsp;</p>
      {pinContent}
      {editContent}
      {deleteContent}
    </div>
  );
}

export default PostInfoTitle;
