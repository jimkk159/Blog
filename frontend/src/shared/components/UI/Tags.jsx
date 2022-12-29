import React from "react";

//Icon
import { AiOutlineTag } from "react-icons/ai";

//CSS
import classes from "./Tags.module.css";

function Tags(props) {
  const { isDarkMode, content } = props;
  return (
    <div className={classes["detail-bottom"]}>
      <AiOutlineTag className={classes["icon"]} />
      {content?.map((tag, index) => (
        <p
          key={index}
          className={`${isDarkMode ? classes["dark"] : classes["light"]}`}
        >
          {tag}
        </p>
      ))}
    </div>
  );
}

export default Tags;
