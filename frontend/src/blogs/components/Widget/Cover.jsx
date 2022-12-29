import React from "react";

//CSS
import classes from "./Cover.module.css";

function Cover(props) {
  return (
    <>
      <img src={props.cover} alt={"Cover"} className={classes["cover"]} />
      <p
        className={`${classes["comment"]} ${
          props.isDarkMode ? classes["dark"] : classes["light"]
        }`}
      >
        公司在 wework 辦公時我非常喜歡他們的 slogan
      </p>
    </>
  );
}

export default Cover;
