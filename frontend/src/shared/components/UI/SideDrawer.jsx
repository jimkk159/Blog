import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

//Custom Component
import Backdrop from "./Backdrop";

//CSS
import classes from "./SideDrawer.module.css";

function SideDrawer(props) {
  const inputContent = props.content ? props.element : props.children;
  const sideDrawerContent = ReactDOM.createPortal(
    <aside
      className={`${classes["side-drawer"]} ${props.className}`}
      onClick={props.onClick}
    >
      {inputContent}
    </aside>,
    document.getElementById("drawer")
  );

  return (
    <>
      {props.show && <Backdrop onClick={props.onCancel} />}
      <CSSTransition
        in={props.show}
        timeout={{ enter: 1000, exit: 500 }}
        classNames={{
          enter: classes["slide-enter"],
          enterActive: classes["slide-enter-active"],
          exit: classes["slide-exit"],
          exitActive: classes["slide-exit-active"],
        }}
        mountOnEnter
        unmountOnExit
      >
        <>{sideDrawerContent}</>
      </CSSTransition>
    </>
  );
}

export default SideDrawer;
