import React from "react";
import ReactDOM from "react-dom";

//CSS
import classes from "./SideDrawer.module.css";

//Custom Component
import Backdrop from "./Backdrop";

function SideDrawer(props) {
  const inputContent = props.content ? props.element : props.children;
  const sideDrawerContent = ReactDOM.createPortal(
    <aside className={classes["side-drawer"]} onClick={props.onClick}>
      {inputContent}
    </aside>,
    document.getElementById("drawer")
  );
  return <>
  <Backdrop onClick={props.onCancel}/>
  { sideDrawerContent }
  </>;
}

export default SideDrawer;
