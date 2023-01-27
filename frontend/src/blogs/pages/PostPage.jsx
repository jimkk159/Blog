import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate, useOutletContext } from "react-router";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";

//Custom Function
import { choiceLanguage } from "../util/choiceLanguage";

//Custom Hook
import useHttp from "../../shared/hooks/http-hook";

//Custom Comonent
import ReadPost from "../components/ReadPost";
import EditPost from "../components/EditPost";
import ErrorModal from "../../shared/components/UI/Modal/ErrorModal";

function PostPage() {
  const [postData, setPostData] = useState(null);
  const [topics, setTopics] = useState(null);
  //ToDo need to check if the correct user
  const [title, setTitle] = useState("No Title");
  const [originState, setOriginState] = useState(null);
  const { edit, postState } = useOutletContext();
  const [isEdit, setIsEdit] = edit;
  const [postEditorState, setPostEditorState] = postState;

  //Redux
  const { isLoggedIn, token } = useSelector((state) => state.auth);
  const isEnglish = useSelector((state) => state.language.isEnglish);

  //React Router
  const navigate = useNavigate();
  const { blogId } = useParams();

  //Custom Hook
  const { isLoading, error, sendRequest, clearError } = useHttp();
  const { isLoadingTopic, errorTopic, sendRequestTopic, clearErrorTopic } =
    useHttp();

  //Edit
  const editModeHandler = () => {
    setIsEdit(true);
    const currentContent = postEditorState.getCurrentContent();
    //For deep copy contentState
    const contentJson = JSON.stringify(convertToRaw(currentContent));
    const originContent = convertFromRaw(JSON.parse(contentJson));
    const originEditorState = EditorState.createWithContent(originContent);
    setOriginState(originEditorState);
  };

  //Read
  const readModeHandler = () => {
    setIsEdit(false);
  };

  //Delete
  const deleteHandler = async (pid) => {
    try {
      if (pid) {
        await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/posts/${pid}`,
          "DELETE",
          null,
          {
            Authorization: "Bearer " + token,
          }
        );
        navigate("/");
      }
    } catch (err) {
    }
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
        setPostEditorState(EditorState.createWithContent(postContentState));
      } catch (err) {}
    };
    fetchPost();
  }, [setPostEditorState, isEnglish, blogId, sendRequest]);

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
      {isEdit ? (
        <EditPost
          postData={postData}
          originState={originState}
          editorState={postEditorState}
          onChange={setPostEditorState}
          onRead={readModeHandler}
          onDelete={deleteHandler}
        />
      ) : (
        <ReadPost
          postData={postData}
          editorState={postEditorState}
          onChange={setPostEditorState}
          onEdit={editModeHandler}
          onDelete={deleteHandler}
          topics={topics}
          title={title}
          isLoading={isLoading || isLoadingTopic}
        />
      )}
    </>
  );
}

export default PostPage;
