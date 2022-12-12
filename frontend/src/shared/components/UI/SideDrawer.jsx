import React from "react";
import ReactDOM from "react-dom";

//CSS
import classes from "./SideDrawer.module.css";

function SideDrawer(props) {
  const inputContent = props.content ? props.element : props.children;
  const sideDrawerContent = (
    <aside className={classes["side-drawer"]} onClick={props.onClick}>
      {inputContent}
    </aside>
  );
  return ReactDOM.createPortal(
    sideDrawerContent,
    document.getElementById("drawer")
  );
}

export default SideDrawer;
