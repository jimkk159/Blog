import React from "react";

//CSS
import classes from "./Image.module.css";

function Image(props) {
  const { img, description, isDarkMode } = props;
  return (
    <>
      <img
        src={img}
        alt="Cover"
        className={`${ classes["cover"]}`}
      />
      <p
        className={`${classes["comment"]} ${
          isDarkMode ? classes["dark"] : classes["light"]
        }`}
      >
        {description}
      </p>
    </>
  );
}

export default Image;
