import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams, useOutletContext } from "react-router";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";

//Custom Function
import { choiceLanguage } from "../util/choiceLanguage";
import convertImgURL from "../../shared/util/url-to-blob";

//Custom Hook
import useHttp from "../../shared/hooks/http-hook";

//Custom Comonent
import ReadPost from "../components/ReadPost";
import EditPost from "../components/EditPost";
import ErrorModal from "../../shared/components/UI/Modal/ErrorModal";
import DeleteModal from "../../shared/components/UI/Modal/DeleteModal";

//CSS
import classes from "./PostPage.module.css"

function PostPage() {
  const [postData, setPostData] = useState(null);
  const [topics, setTopics] = useState(null);
  const [title, setTitle] = useState("No Title");
  const [originState, setOriginState] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [prevToken, setPrevToken] = useState(null);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  //Redux
  const { token, isLoggedIn } = useSelector((state) => state.auth);
  const isEnglish = useSelector((state) => state.language.isEnglish);

  //React Router
  const { blogId } = useParams();
  const { edit } = useOutletContext();
  const [isEdit, setIsEdit] = edit;

  //Custom Hook
  const { isLoading, error, sendRequest, clearError } = useHttp();
  const {
    isLoading: isLoadingSave,
    error: errorSave,
    sendRequest: sendRequestSave,
    clearError: clearErrorSave,
  } = useHttp();
  const {
    isLoading: isLoadingTopic,
    error: errorTopic,
    sendRequest: sendRequestTopic,
    clearError: clearErrorTopic,
  } = useHttp();

  //Edit
  const editModeHandler = () => {
    setIsEdit(true);
  };

  //Read
  const readModeHandler = () => {
    setIsEdit(false);
  };

  //Save the Post
  const postId = postData?.id;
  const savePostHandler = useCallback(
    async (token) => {
      try {
        if (!postId) return;
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
        await sendRequestSave(
          process.env.REACT_APP_BACKEND_URL + `/posts/${postId}`,
          "PUT",
          sendForm,
          {
            Authorization: "Bearer " + token,
          }
        );
        setIsEdit(false);
      } catch (err) {}
    },
    [isEnglish, postId, editorState, sendRequestSave, setIsEdit]
  );

  //Delete
  const showDeleteHandler = (event) => {
    event.stopPropagation();
    console.log("delete");
    setShowWarning(true);
  };

  //GET Topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const responseData = await sendRequestTopic(
          process.env.REACT_APP_BACKEND_URL + "/topics"
        );
        setTopics(responseData);
      } catch (err) {}
    };
    fetchTopics();
  }, [sendRequestTopic]);

  //GET POST
  useEffect(() => {
    console.log("GET POST");
    const fetchPost = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/posts/${blogId}`
        );
        setTitle(
          choiceLanguage(
            isEnglish,
            responseData?.language.en?.title,
            responseData?.language.ch?.title,
            "No Title"
          )
        );
        setPostData(responseData);
        const postJSON = JSON.parse(
          choiceLanguage(
            isEnglish,
            responseData?.language.en?.contentState,
            responseData?.language.ch?.contentState,
            EditorState.createEmpty()
          )
        );
        const postContentState = convertFromRaw(postJSON);
        setOriginState(EditorState.createWithContent(postContentState));
        setEditorState(EditorState.createWithContent(postContentState));
      } catch (err) {}
    };
    fetchPost();
  }, [setEditorState, isEnglish, blogId, sendRequest]);

  useEffect(() => {
    setPrevToken(token);
  }, [token]);

  useEffect(() => {
    if (!isLoggedIn && isEdit) {
      savePostHandler(prevToken);
      setPrevToken(null);
    }
  }, [prevToken, isLoggedIn, isEdit, setIsEdit, savePostHandler]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} isAnimate />
      <ErrorModal error={errorTopic} onClear={clearErrorTopic} isAnimate />
      <DeleteModal
        pid={postData?.id}
        title={title}
        show={showWarning}
        setShow={setShowWarning}
        sendRequest={sendRequest}
      />
      {isEdit ? (
        <EditPost
          tagsClassName={classes["tags-container"]}
          postData={postData}
          originState={originState}
          editorState={editorState}
          isLoading={isLoadingSave}
          token={token}
          onChange={setEditorState}
          onSave={savePostHandler}
          onRead={readModeHandler}
          onDelete={showDeleteHandler}
          error={errorSave}
          clearError={clearErrorSave}
        />
      ) : (
        <ReadPost
          tagsClassName={classes["tags-container"]}
          title={title}
          topics={topics}
          postData={postData}
          editorState={editorState}
          onChange={setEditorState}
          onEdit={editModeHandler}
          onDelete={showDeleteHandler}
          isLoading={isLoading || isLoadingTopic}
        />
      )}
    </>
  );
}

export default PostPage;
