import React from "react";

//CSS
import classes from "./Avatar.module.css";

function Avatar(props) {
  return (
    <div className={`${classes.avatar} ${props.className}`}>
      {<img src={props.image} alt={props.alt} />}
    </div>
  );
}

export default Avatar;
