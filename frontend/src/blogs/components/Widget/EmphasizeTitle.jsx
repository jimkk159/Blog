import React from "react";

//CSS
import classes from "./EmphasizeTitle.module.css";

function EmphasizeTitle(props) {
  const { content, children } = props;
  if (content)
    return (
      <h3
        className={`${classes["title"]} ${
          props.isDarkMode ? classes["dark"] : classes["light"]
        }`}
      >
        {content}
      </h3>
    );
  return (
    <h3
      className={`${classes["title"]} ${
        props.isDarkMode ? classes["dark"] : classes["light"]
      }`}
    >
      {children}
    </h3>
  );
}

export default EmphasizeTitle;
