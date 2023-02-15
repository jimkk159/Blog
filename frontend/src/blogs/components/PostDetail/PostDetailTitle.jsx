import React from "react";
import { useSelector } from "react-redux";

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
  const {
    postId,
    title,
    date,
    authorId,
    author,
    avatar,
    isNew,
    isPined,
    isDarkMode,
    onEdit,
    onDelete,
  } = props;

  const authorAvatar = avatar
    ? avatar.startsWith("https://") || avatar.startsWith("http://")
      ? avatar
      : `${process.env.REACT_APP_BACKEND_URL}/${avatar}`
    : null;

  //Redux
  const { isAdmin, uid, token } = useSelector((state) => state.auth);

  const editHandler = (event) => {
    event.stopPropagation();
    onEdit();
    console.log("edit");
  };

  let editContent;
  if (authorId === uid) {
    editContent = (
      <AiOutlineEdit
        className={`${classes["icon"]} ${classes["edit"]} ${
          !isDarkMode && classes["light-pencil"]
        }`}
        onClick={editHandler}
      />
    );
  } else if (isNew) {
    editContent = (
      <AiOutlineEdit
        className={`${classes["icon"]} ${classes["edit"]} ${
          !isDarkMode && classes["light-pencil"]
        }`}
      />
    );
  }

  let deleteContent;
  if (isAdmin || authorId === uid) {
    deleteContent = (
      <AiFillDelete
        className={`${classes["icon"]} ${classes["delete"]} ${
          !isDarkMode && classes["light-trash-can"]
        }`}
        onClick={onDelete}
      />
    );
  } else if (isNew) {
    deleteContent = (
      <AiFillDelete
        className={`${classes["icon"]} ${classes["delete"]} ${
          !isDarkMode && classes["light-trash-can"]
        }`}
      />
    );
  }

  let pinContent;
  pinContent = (
    <Pin
      className={`${classes["icon"]} ${classes["pin"]} ${
        !isDarkMode && classes["light-pin"]
      }`}
      show={isAdmin && !isNew}
      token={token}
      postId={postId}
      isPined={isPined}
      isAdmin={isAdmin}
      isDarkMode={isDarkMode}
    />
  );

  return (
    <>
      <h1 className={classes["title"]}>{title}</h1>
      <div className={classes["container"]}>
        <div className={`${classes["flex-container"]} ${classes["flex-end"]}`}>
          <div
            className={`${classes["flex-container"]} ${classes["icon-left"]}`}
          >
            {editContent}
            {deleteContent}
            {pinContent}
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
            img={authorAvatar}
          />
        </div>
      </div>
      <hr className={classes["title-hr"]} />
    </>
  );
}

export default PostDetailTitle;