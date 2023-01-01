import React from "react";

//CSS
import classes from "./Alert.module.css";

const Alert = (props) => {
  return (
    <div className={`${props.className} ${classes.modal}`} style={props.style}>
      <div className={`${classes.container}`}>
      <header className={`${classes.header} ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <div className={`${classes.content} ${props.contentClass}`}>
        {props.children}
      </div>
      <footer className={`${classes.footer} ${props.footerClass}`}>
        {props.footer}
      </footer>
      </div>
    </div>
  );
};

export default Alert;
