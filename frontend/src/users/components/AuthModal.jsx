import React from "react";

//Custom Component
import AuthForm from "./AuthForm";
import Modal from "../../shared/components/UI/Modal/Modal";

//Custom Hook
import useMediaQuery from "../../shared/hooks/media-query-hook";

//CSS
import classes from "./AuthModal.module.css";

function AuthModal(props) {
  const { show, setShowModal } = props;
  const { matches } = useMediaQuery("min", "768");

  //Custom Modal Style
  const customModalStyle = matches
    ? {
        left: "calc(50% - 12.5rem)",
        width: "25rem",
      }
    : {};

  //Toggle Modal
  //const openModalHandler=()=>setShowModal(true)
  const closeModalHandler = () => {
    setShowModal(false);
  };

  //SubmitHandler
  const submitHandler = () => {
    setShowModal(false);
  };

  return (
    <Modal
      show={show}
      className={classes["auth-modal"]}
      style={customModalStyle}
      isAnimate={props.isAnimate}
      onCancel={closeModalHandler}
    >
      <AuthForm onSubmit={submitHandler} isLogin={props.isLogin} />
    </Modal>
  );
}

export default AuthModal;
