import React from "react";
import { BsFillPinAngleFill, BsFillPinFill } from "react-icons/bs";

//CSS
// import classes from "./Pin.module.css";

function Pin(props) {
  if (props.isPined)
    return (
      <BsFillPinFill className={`${props.className} ${props.pin}`} onClick={null} />
    );
  if (props.isAdmin)
    return (
      <BsFillPinAngleFill
        className={`${props.className}  ${props.pin}`}
        onClick={null}
      />
    );
  return;
}

export default Pin;
