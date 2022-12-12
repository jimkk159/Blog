import React from "react";
import ReactDOM from "react-dom";

//CSS
import classes from "./Modal.module.css";

//Custom component
import Backdrop from "./Backdrop";

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
