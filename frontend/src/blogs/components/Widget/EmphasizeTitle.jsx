import React from "react";

//CSS
import classes from "./EmphasizeTitle.module.css";

function EmphasizeTitle(props) {
  return (
    <h3
      className={`${classes["title"]} ${
        props.isDarkMode
          ? classes["dark"]
          : classes["light"]
      }`}
    >
      Segmentation 相關文章
    </h3>
  );
}

export default EmphasizeTitle;
