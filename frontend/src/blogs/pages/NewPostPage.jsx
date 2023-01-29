import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import { convertToRaw } from "draft-js";

//Custom Function
import convertImgURL from "../../shared/util/url-to-blob";

//Custom Hook
import useHttp from "../../shared/hooks/http-hook";

//Custom Component
import Button2 from "../../shared/components/Form/Button2";
import Backdrop from "../../shared/components/UI/Backdrop";
import ErrorModal from "../../shared/components/UI/Modal/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import RichTextEditor from "../../shared/components/TextEditor/RichTextEditor";

//CSS
import classes from "./NewPostPage.module.css";

function NewPostPage() {
  const {
    newPostState: [editorState, setEditorState],
  } = useOutletContext();

  //Redux
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isEnglish = useSelector((state) => state.language.isEnglish);
  const { avatar, token } = useSelector((state) => state.auth);

  //Custom Hook
  const { isLoading, error, sendRequest, clearError } = useHttp();

  //React Router
  const navigate = useNavigate();

  //Save the Post
  const savePostHandler = async () => {
    try {
      const currentContent = editorState.getCurrentContent();
      const rawData = JSON.stringify(convertToRaw(currentContent));
      const [imgBlobs, convertedData] = convertImgURL(rawData);
      const createSendForm = (imgArray, draftRawData) => {
        const formData = new FormData();
        formData.append("language", isEnglish ? "en" : "ch");
        formData.append("contentState", draftRawData);
        for (let i = 0; i < imgArray.length; i++) {
          formData.append("images", imgArray[i]);
        }
        return formData;
      };
      const sendForm = createSendForm(imgBlobs, convertedData);
      //ToDo change the post type when update
      const response = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/posts/new`,
        "POST",
        sendForm,
        {
          Authorization: "Bearer " + token,
        }
      );
      navigate(`/blog/${response.pid}`);
    } catch (err) {}
  };

  //Cancel the Post
  const cancelPostHandler = () => {
      navigate(-1);
  };

  //Create a Post need to Login
  useEffect(() => {
    if (!isLoggedIn) navigate(`/`);
  }, [isLoggedIn, navigate]);

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
        editorState={editorState}
        onChange={setEditorState}
      />
      <div className={`${classes["btn-container"]}`}>
        <Button2
          className={`${classes["btn"]}`}
          disabled={isLoading}
          onClick={savePostHandler}
        >
          SAVE
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

export default NewPostPage;
