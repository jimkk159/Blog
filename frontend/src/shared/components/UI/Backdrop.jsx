import React from "react";
import ReactDOM from "react-dom";

//CSS
import classes from "./Backdrop.module.css";

function Backdrop({ onClick }) {
  const clickHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (onClick) onClick();
  };

  const content = (
    <div className={classes.backdrop} onClick={clickHandler}></div>
  );

  return ReactDOM.createPortal(content, document.getElementById("backdrop"));
}

export default Backdrop;
