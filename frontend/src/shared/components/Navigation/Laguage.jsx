import React from "react";

//Custom Component
import Toggle from "../UI/Toggle";

//CSS
import classes from "./Laguage.module.css";

function Languae(props) {
  return (
    <div className={props.className}>
      <Toggle className={`${props.className}`}>{props.children}</Toggle>
    </div>
  );
}

export default Languae;
