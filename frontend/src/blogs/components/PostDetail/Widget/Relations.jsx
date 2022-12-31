import React from "react";

//CSS
import classes from "./Relations.module.css";

function Relations(props) {
  const { relations } = props;
  return (
    <>
      <h1
        className={`${classes["title"]} ${
          props.isDarkMode ? classes["dark"] : classes["light"]
        }`}
      >
        Segmentation 相關文章
      </h1>
      <ul className={classes["list-items"]}>
        {relations.map((element, index) => (
          <li key={index} className={classes["list-item"]}>
            {element}
          </li>
        ))}
      </ul>
    </>
  );
}

export default Relations;
