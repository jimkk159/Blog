import React from "react";
import ReactDOM from "react-dom";

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

  return (
    <>
      {props.show && <Backdrop onClick={props.onCancel} />}
      {props.show && ModalContent}
    </>
  );
}

export default Modal;
