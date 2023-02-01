import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import { EditorState, convertToRaw } from "draft-js";

//Custom Function
import convertImgURL from "../../shared/util/url-to-blob";

//Custom Hook
import useHttp from "../../shared/hooks/http-hook";

//Custom Component
import Button2 from "../../shared/components/Form/Button2";
import Backdrop from "../../shared/components/UI/Backdrop";
import ErrorModal from "../../shared/components/UI/Modal/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import PostEditor from "../../shared/components/TextEditor/PostEditor";

//CSS
import classes from "./NewPostPage.module.css";

function NewPostPage() {
  const [postCover, setPostCover] = useState();
  const [titleState, setTitleState] = useState(() => EditorState.createEmpty());
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  //Redux
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isEnglish = useSelector((state) => state.language.isEnglish);
  const { token } = useSelector((state) => state.auth);

  //React Router
  const navigate = useNavigate();
  const { edit } = useOutletContext();
  const setIsEdit = edit[1];

  //Custom Hook
  const { isLoading, error, sendRequest, clearError } = useHttp();

  //Save the Post Title
  const savePostTitleHandler = () => {
    const currentContent = titleState.getCurrentContent();
    const contentBlock = currentContent.getFirstBlock();
    const postTitle = contentBlock.getText();
    return postTitle;
  };

  //Save the Post Editor
  const savePostContentHandler = () => {
    const currentContent = editorState.getCurrentContent();
    const rawData = JSON.stringify(convertToRaw(currentContent));
    return rawData;
  };

  //Save the Post
  const savePostHandler = async () => {
    try {
      const title = savePostTitleHandler();
      const contentRawData = savePostContentHandler();
      const [imgBlobs, convertedData] = convertImgURL(contentRawData);
      const createSendForm = (imgArray, draftRawData) => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("cover", postCover);
        formData.append("language", isEnglish ? "en" : "ch");
        formData.append("contentState", draftRawData);
        for (let i = 0; i < imgArray.length; i++) {
          formData.append("images", imgArray[i]);
        }
        return formData;
      };

      const sendForm = createSendForm(imgBlobs, convertedData);
      const response = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/posts/new`,
        "POST",
        sendForm,
        {
          Authorization: "Bearer " + token,
        }
      );
      setIsEdit(false);
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

  useEffect(() => {
    setIsEdit(true);
  }, [setIsEdit]);

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
      <PostEditor
        editorState={editorState}
        onChange={setEditorState}
        titleState={titleState}
        onTitle={setTitleState}
        onCover={setPostCover}
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
