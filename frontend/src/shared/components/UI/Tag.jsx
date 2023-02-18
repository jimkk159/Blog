import React from "react";
import { useNavigate } from "react-router-dom";

//CSS
import classes from "./Tag.module.css";

function Tag(props) {
  const { className, tag, isEdit, isDarkMode, onClick, onKeyDown } = props;
  const navigate = useNavigate();
  const clickHandler = () => {
    if (onClick) onClick();
    if (!isEdit) {
      navigate(`/search/${tag}`);
    }
  };

  return (
    <div
      className={`${className} ${classes["tag"]} ${
        isDarkMode ? classes["dark"] : classes["light"]
      }`}
      onKeyDown={(event) => {
        if (onKeyDown && isEdit) onKeyDown(event);
      }}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={clickHandler}
    >
      {tag}
    </div>
  );
}

export default Tag;
