import React from "react";

//Icon
import { AiOutlineTag } from "react-icons/ai";

//Custom Component
import Tag from "./Tag";

//CSS
import classes from "./Tags.module.css";

function Tags(props) {
  const { isDarkMode, content } = props;

  return (
    <div className={classes["detail-bottom"]}>
      <AiOutlineTag className={classes["icon"]} />
      {content?.map((tag, index) => (
        <Tag key={index} isDarkMode={isDarkMode} tag={tag} />
      ))}
    </div>
  );
}

export default Tags;
