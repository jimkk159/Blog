import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

//Custom Component
import Backdrop from "../Backdrop";

//CSS
import classes from "./Modal.module.css";

function Modal(props) {
  const { content, show, style, children, onCancel, isAnimate } = props;
  const inputContent = content ? content : children;
  const preventPropagation = (event) => event.stopPropagation();
  const ModalContent = ReactDOM.createPortal(
    <div
      className={`${classes.modal} ${props.className}`}
      style={style}
      onClick={preventPropagation}
    >
      {inputContent}
    </div>,
    document.getElementById("modal")
  );

  const cancelHandler = () => {
    onCancel();
  };

  if (isAnimate) {
    return (
      <>
        {show && <Backdrop onClick={onCancel} />}
        <CSSTransition
          in={show}
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
      {show && <Backdrop onClick={cancelHandler} />}
      {show && ModalContent}
    </>
  );
}

export default Modal;
