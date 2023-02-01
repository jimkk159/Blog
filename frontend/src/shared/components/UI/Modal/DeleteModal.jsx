import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//Custom Component
import Button from "../../Form/Button";
import WarningModal from "./WarningModal";

//CSS
import classes from "./DeleteModal.module.css";

function DeleteModal(props) {
  const { pid, title, onDelete, show, setShow, sendRequest } = props;

  //Redux
  const { token } = useSelector((state) => state.auth);

  //React Router
  const navigate = useNavigate();

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
      console.log("navigate");
      navigate("/");
    } catch (err) {}
  };

  return (
    <WarningModal
      show={show}
      className={classes["warning-modal"]}
      onCancel={cancelDeleteHandler}
      header={"Warning!"}
      content={`Are you sure to delete 「${title}」?`}
      footer={
        <div className={classes["button-container"]}>
          <Button
            className={`${classes["button"]} ${classes["delete-btn"]}`}
            onClick={confirmDeleteHandler}
          >
            DELETE
          </Button>
          <Button
            className={`${classes["button"]} ${classes["cancel-btn"]}`}
            onClick={cancelDeleteHandler}
          >
            CANCEL
          </Button>
        </div>
      }
      isAnimate
    />
  );
}

export default DeleteModal;