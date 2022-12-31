import React from "react";
import { Link } from "react-router-dom";

//CSS
import classes from "./Tag.module.css";

function Tag(props) {
  const { tag, isDarkMode } = props;
  return (
    <Link
      to={`/search/${tag}`}
      className={`${isDarkMode ? classes["dark"] : classes["light"]}`}
      onClick={(event)=>{event.stopPropagation();}}
    >
      {tag}
    </Link>
  );
}

export default Tag;
