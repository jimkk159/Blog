import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { convertToRaw } from "draft-js";

//Custom Function
import convertImgURL from "../../shared/util/url-to-blob";

//Custom Component
import Button2 from "../../shared/components/Form/Button2";
import Backdrop from "../../shared/components/UI/Backdrop";
import ErrorModal from "../../shared/components/UI/Modal/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import RichTextEditor from "../../shared/components/TextEditor/RichTextEditor";

//Custom Hook
import useHttp from "../../shared/hooks/http-hook";

//CSS
import classes from "./EditPost.module.css";

function EditPost(props) {
  const { postData, originState, editorState, onChange, onRead, onDelete } =
    props;

  //Redux
  const { userId, avatar, token } = useSelector((state) => state.auth);
  const isEnglish = useSelector((state) => state.language.isEnglish);

  //Custom Hook
  const { isLoading, error, sendRequest, clearError } = useHttp();

  //Save the Post
  const editPostHandler = async () => {
    try {
      if (!postData.id) return;
      const currentContent = editorState.getCurrentContent();
      const rawData = JSON.stringify(convertToRaw(currentContent));
      const [imgBlobs, convertedData] = convertImgURL(rawData);
      const createSendForm = (imgArray, draftRawData) => {
        const formData = new FormData();
        formData.append("uid", userId);
        formData.append("language", isEnglish ? "en" : "ch");
        formData.append("contentState", draftRawData);
        for (let i = 0; i < imgArray.length; i++) {
          formData.append("images", imgArray[i]);
        }
        return formData;
      };
      const sendForm = createSendForm(imgBlobs, convertedData);
      //ToDo change the post type when update
      //ToDo need to check user
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/posts/${postData.id}`,
        "PUT",
        sendForm,
        {
          Authorization: "Bearer " + token,
        }
      );
      onRead();
    } catch (err) {}
  };

  //Delete the Post
  const deletePostHandler = () => {
    console.log("Delete");
    onDelete(postData.id);
  };

  //Cancel the Post
  const cancelPostHandler = () => {
    onRead();
    onChange(originState);
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <>
          <Backdrop />
          <div className={`${classes["loading-container"]}`}>
            <LoadingSpinner asOverlay />
          </div>
        </>
      )}
      <RichTextEditor
        postData={postData}
        originState={originState}
        editorState={editorState}
        onChange={onChange}
        onRead={onRead}
        onDelete={onDelete}
      />
      <div className={`${classes["btn-container"]}`}>
        <Button2
          className={`${classes["btn"]}`}
          disabled={isLoading}
          onClick={editPostHandler}
        >
          SAVE
        </Button2>
        <Button2
          className={`${classes["btn"]}`}
          disabled={isLoading}
          onClick={deletePostHandler}
        >
          DELETE
        </Button2>
        <Button2
          className={`${classes["btn"]}`}
          disabled={isLoading}
          onClick={cancelPostHandler}
        >
          Cancel
        </Button2>
      </div>
    </>
  );
}

export default EditPost;
