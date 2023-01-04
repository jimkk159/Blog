import React from "react";

//Custom Component
import Modal from "./Modal";
import Alert from "../Alert";

//CSS
import classes from "./WarningModal.module.css"

function WarningModal(props) {
  const content = props.content ? props.content : props.children;
  return (
    <Modal
      show={props.show}
      onCancel={props.onCancel}
      isAnimate={props.isAnimate}
      className={props.className}
    >
      <Alert
        className={`${classes["modal"]}`}
        header={props.header}
        headerClass={props.headerClass}
        contentClass={`${classes["warning-content"]} ${props.contentClass}`}
        footer={props.footer}
        footerClass={props.footerClass}
      >
        {content}
      </Alert>
    </Modal>
  );
}

export default WarningModal;
