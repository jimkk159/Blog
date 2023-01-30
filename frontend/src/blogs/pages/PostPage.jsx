import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useOutletContext } from "react-router";
import { EditorState, convertFromRaw } from "draft-js";

//Custom Function
import { choiceLanguage } from "../util/choiceLanguage";

//Custom Hook
import useHttp from "../../shared/hooks/http-hook";

//Custom Comonent
import ReadPost from "../components/ReadPost";
import EditPost from "../components/EditPost";
import ErrorModal from "../../shared/components/UI/Modal/ErrorModal";
import DeleteModal from "../../shared/components/UI/Modal/DeleteModal";

function PostPage() {
  const [postData, setPostData] = useState(null);
  const [topics, setTopics] = useState(null);
  const [title, setTitle] = useState("No Title");
  const [originState, setOriginState] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  //Redux
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isEnglish = useSelector((state) => state.language.isEnglish);

  //React Router
  const { blogId } = useParams();
  const { edit, postState } = useOutletContext();
  const [isEdit, setIsEdit] = edit;
  const [postEditorState, setPostEditorState] = postState;

  //Custom Hook
  const { isLoading, error, sendRequest, clearError } = useHttp();
  const { isLoadingTopic, errorTopic, sendRequestTopic, clearErrorTopic } =
    useHttp();

  //Edit
  const editModeHandler = () => {
    setIsEdit(true);
  };

  //Read
  const readModeHandler = () => {
    setIsEdit(false);
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
        setPostEditorState(EditorState.createWithContent(postContentState));
      } catch (err) {}
    };
    fetchPost();
  }, [setPostEditorState, isEnglish, blogId, sendRequest]);

  //Delete
  const showDeleteHandler = (event) => {
    event.stopPropagation();
    console.log("delete");
    setShowWarning(true);
  };

  useEffect(() => {
    //Todo Save the Post when auto logout
    if (!isLoggedIn) setIsEdit(false);
    return () => {
      setIsEdit(false);
    };
  }, [isLoggedIn, setIsEdit]);

  //ToDo fix loading and error modal
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
          postData={postData}
          originState={originState}
          editorState={postEditorState}
          onChange={setPostEditorState}
          onRead={readModeHandler}
          onDelete={showDeleteHandler}
        />
      ) : (
        <ReadPost
          title={title}
          topics={topics}
          postData={postData}
          editorState={postEditorState}
          onChange={setPostEditorState}
          onEdit={editModeHandler}
          onDelete={showDeleteHandler}
          isLoading={isLoading || isLoadingTopic}
        />
      )}
    </>
  );
}

export default PostPage;
