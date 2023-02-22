import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//Custom Component
import Button from "../../Form/Button";
import WarningModal from "./WarningModal";
import LoadingSpinner from "../LoadingSpinner";

//Custom Hook
import useHttp from "../../../hooks/http-hook";

//CSS
import classes from "./DeleteModal.module.css";
import ErrorModal from "./ErrorModal";

function DeleteModal(props) {
  const { pid, title, onDelete, show, setShow } = props;

  //Redux
  const token = useSelector((state) => state.auth.token);
  const language = useSelector((state) => state.language.language);

  //React Router
  const navigate = useNavigate();

  //Custom Hook
  const { isLoading, error, sendRequest, clearError } = useHttp();

  //Delete
  const cancelDeleteHandler = () => {
    console.log("canacel");
    setShow(false);
  };

  const confirmDeleteHandler = async () => {
    console.log("delete confirm");
    setShow(false);
    try {
      if (!pid) return;
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/posts/${pid}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + token,
        }
      );
      if (onDelete) {
        onDelete(pid);
      }
      navigate("/");
    } catch (err) {}
  };

  //Todo Send loading
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <WarningModal
        show={show !== isLoading}
        className={`${classes["warning-modal"]}`}
        onCancel={cancelDeleteHandler}
        header={language.warning}
        content={
          <>
            {isLoading && <LoadingSpinner asOverlay />}
            {!isLoading && `${language["deleteWarning"]}「${title}」?`}
          </>
        }
        footer={
          <div className={classes["button-container"]}>
            <Button
              className={`${classes["button"]} ${classes["delete-btn"]}`}
              onClick={confirmDeleteHandler}
            >
              {language["deleteBtn"]}
            </Button>
            <Button
              className={`${classes["button"]} ${classes["cancel-btn"]}`}
              onClick={cancelDeleteHandler}
            >
              {language["cancelBtn"]}
            </Button>
          </div>
        }
        isAnimate
      />
    </>
  );
}

export default DeleteModal;