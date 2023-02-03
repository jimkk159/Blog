import React from "react";
import { Link } from "react-router-dom";

//CSS
import classes from "./Tag.module.css";

function Tag(props) {
  const { className, tag, isEdit, isDarkMode, onClick, onKeyDown } = props;
  if (isEdit)
    return (
      <div
        className={`${className} ${classes["tag"]} ${
          isDarkMode ? classes["dark"] : classes["light"]
        }`}
        onKeyDown={onKeyDown}
        onClick={onClick}
        onMouseDown={(event) => event.stopPropagation()}
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
      onMouseDown={(event) => event.stopPropagation()}
      onClick={
        onClick
          ? onClick
          : (event) => {
              event.stopPropagation();
            }
      }
    >
      {tag}
    </Link>
  );
}

export default Tag;
