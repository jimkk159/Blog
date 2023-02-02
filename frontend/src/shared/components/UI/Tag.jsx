import React from "react";
import { Link } from "react-router-dom";

//CSS
import classes from "./Tag.module.css";

function Tag(props) {
  const { className, tag, isEdit, isDarkMode, onKeyDown } = props;
  if (isEdit)
    return (
      <div
        className={`${className} ${classes["tag"]} ${
          isDarkMode ? classes["dark"] : classes["light"]
        }`}
        onKeyDown={onKeyDown}
      >
        {tag}
      </div>
    );
  return (
    <Link
      to={`/search/${tag}`}
      className={`${className} ${classes["tag"]} ${
        isDarkMode ? classes["dark"] : classes["light"]
      }`}
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      {tag}
    </Link>
  );
}

export default Tag;
