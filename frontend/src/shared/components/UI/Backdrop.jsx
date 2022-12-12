import React from "react";
import ReactDOM from "react-dom";

//CSS
import classes from "./Backdrop.module.css";

function Backdrop(props) {
  const content = (
    <div className={classes.backdrop} onClick={props.onClick}></div>
  );
  return ReactDOM.createPortal(content, document.getElementById("backdrop"));
}

export default Backdrop;
