import React from "react";
import { BsFillPinAngleFill, BsFillPinFill } from "react-icons/bs";

//CSS
// import classes from "./Pin.module.css";

function Pin(props) {
  const {show, isPined, isAdmin} = props
  if (!show) return;
  //ToDo send request to change isPined
  if (isPined)
    return (
      <BsFillPinFill
        className={`${props.className} ${props.pin}`}
        onClick={props.onToggle}
      />
    );
  if (isAdmin)
    return (
      <BsFillPinAngleFill
        className={`${props.className}  ${props.pin}`}
        onClick={props.onToggle}
      />
    );
  return;
}

export default Pin;
