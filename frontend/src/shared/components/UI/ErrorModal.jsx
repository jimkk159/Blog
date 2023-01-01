import React from "react";

//Custom Component
import Modal from "./Modal";
import Button from "../Form/Button";
import Alert from "./Alert";

//CSS
import classes from "./ErrorModal.module.css"

const ErrorModal = (props) => {
  return (
    <Modal
      show={!!props.error}
      onCancel={props.onClear}
      isAnimate={props.isAnimate}
    >
      <Alert
        header="An Error Occurred!"
        footer={<Button className={classes["button"]} onClick={props.onClear}>Okay</Button>}
      >
        {props.error}
      </Alert>
    </Modal>
  );
};

export default ErrorModal;
