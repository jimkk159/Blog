import React from "react";

import classes from "./Input.module.css";

function Input(props) {
    console.log(classes["input-control"]);
  return (
    <div className={`${classes["input-control"]} ${classes["input-invalid"]}`}>
      <label htmlFor={props.id}>{props.label}</label>
      <input id={props.id} type={props.type} />
      <p>{props.errorMessage}</p>
    </div>
  );
}

export default Input;
