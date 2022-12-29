import React from "react";

//CSS
import classes from "./Image.module.css";

function Image(props) {
  const { type, alt, img, description, isDarkMode } = props;
  return (
    <>
      <img
        src={img}
        alt={type === "cover" ? "Cover" : alt ? alt : "User Image"}
        className={`${type === "cover" ? classes["cover"] : classes["img"]}`}
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
