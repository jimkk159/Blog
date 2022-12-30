import React from "react";
import { BsFillPinAngleFill, BsFillPinFill } from "react-icons/bs";

//CSS
// import classes from "./Pin.module.css";

function Pin(props) {
  if (props.isPined)
    return (
      <BsFillPinFill
        className={`${props.className} ${props.pin}`}
        onClick={props.onToggle}
      />
    );
  if (props.isAdmin)
    return (
      <BsFillPinAngleFill
        className={`${props.className}  ${props.pin}`}
        onClick={props.onToggle}
      />
    );
  return;
}

export default Pin;
