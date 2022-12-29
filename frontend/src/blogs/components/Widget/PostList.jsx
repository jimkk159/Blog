import React from "react";

//CSS
import classes from "./PostList.module.css";

function PostList(props) {
  const { content: lists } = props;
  return (
    <ul className={`${classes["list-items"]}`}>
      {lists.map((element, index) => (
        <li key={index} className={`${classes["list-item"]}`}>
          {element}
        </li>
      ))}
    </ul>
  );
}

export default PostList;
