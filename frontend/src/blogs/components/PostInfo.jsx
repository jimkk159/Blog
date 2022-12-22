import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineEdit, AiFillDelete } from "react-icons/ai";

//Custom Component
import Card from "../../shared/components/UI/Card";
import Pin from "../../shared/components/Icons/Pin";

//Custom Hook
import useMediaQuery from "../../shared/hooks/media-query-hook";

//CSS
import classes from "./PostInfo.module.css";

function PostInfo(props) {
  const { description } = props;
  const backgroundColor =
    !props.isDarkMode &&
    (props.isOdd ? classes["light-blue"] : classes["light-green"]);
  let content = description;

  //Custom Hook
  const { matches } = useMediaQuery("min", "768");
  const limit = matches ? 200 : 150;
  if (description.length > limit) {
    let count = limit;
    for (let i = limit; description[i - 1] !== " " && i < limit + 50; i++) {
      count = i;
    }
    content = (
      <p>
        {description.slice(0, count) + "... ( "}
        <Link
          to="/blog"
          className={
            props.isDarkMode ? classes["link-yellow"] : classes["link-blue"]
          }
        >
          {"more"}
        </Link>
        {" )"}
      </p>
    );
  }

  const editHandler = () => {
    console.log("edit");
  };
  const deleteHandler = () => {
    console.log("delete");
  };

  return (
    <Card
      className={`${classes["info-container"]} ${backgroundColor}`}
      isDarkMode={props.isDarkMode}
    >
      <div className={classes["info-content"]}>
        <h1>{props.title}</h1>
        <p className={classes["statement"]}>Created by&nbsp;&nbsp;</p>
        <p className={classes["author"]}>{props.author}&nbsp;&nbsp;</p>
        <p className={classes["statement"]}>on {props.date}</p>
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
        <hr />
        <div className={classes["info-description"]}>
          <img src={props.image} alt="blog-cover" />
          {content}
        </div>
      </div>
    </Card>
  );
}

export default PostInfo;
