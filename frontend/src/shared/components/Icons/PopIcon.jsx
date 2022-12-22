import React from "react";

//Custom Conponent
import Icon from "./Icon";

//CSS
import classes from "./PopIcon.module.css";

function PopIcon(props) {
  if (!props.icon) return;

  return (
    <div className={classes["pop"]}>
      <Icon className={props.iconClassName} style={props.iconStyle} />
    </div>
  );
}

export default PopIcon;
