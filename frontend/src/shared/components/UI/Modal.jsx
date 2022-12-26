import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

//Custom Component
import Backdrop from "./Backdrop";

//CSS
import classes from "./Modal.module.css";

function Modal(props) {
  const inputContent = props.content ? props.content : props.children;
  const ModalContent = ReactDOM.createPortal(
    <div className={`${classes.modal} ${props.className}`} style={props.style}>
      {inputContent}
    </div>,
    document.getElementById("modal")
  );
  if (props.isAnimate) {
    return (
      <>
        {props.show && <Backdrop onClick={props.onCancel} />}
        <CSSTransition
          in={props.show}
          timeout={{ enter: 1000, exit: 500 }}
          classNames={{
            enter: classes["modal-enter"],
            enterActive: classes["modal-enter-active"],
            exit: classes["modal-exit"],
            exitActive: classes["modal-exit-active"],
            exitDone: classes["modal-exit-done"],
          }}
          mountOnEnter
          unmountOnExit
        >
          <>{ModalContent}</>
        </CSSTransition>
      </>
    );
  }

  return (
    <>
      {props.show && <Backdrop onClick={props.onCancel} />}
      {props.show && ModalContent}
    </>
  );
}

export default Modal;
