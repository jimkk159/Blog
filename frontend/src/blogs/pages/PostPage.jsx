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
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";

//CSS
import classes from "./PostPage.module.css";

function PostPage() {
  const [postData, setPostData] = useState(null);
  const [topics, setTopics] = useState(null);
  //ToDo need to check if the correct user
  const [title, setTitle] = useState("No Title");
  const { edit, postState } = useOutletContext();
  const [isEdit, setIsEdit] = edit;
  const [postEditorState, setPostEditorState] = postState;

  //Redux
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isEnglish = useSelector((state) => state.language.isEnglish);

  //React Router
  const { blogId } = useParams();

  //Custom Hook
  const { isLoading, error, sendRequest, clearError } = useHttp();

  //GET Topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/topics"
        );
        setTopics(responseData);
      } catch (err) {}
    };
    fetchTopics();
  }, [sendRequest]);

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

  return (
    <div className={classes["flex-container"]}>
      <ErrorModal error={error} onClear={clearError} isAnimate />
      {isLoading && <LoadingSpinner className={`loading-container`} />}
      {isEdit ? (
        <EditPost editorState={postEditorState} onChange={setPostEditorState} />
      ) : (
        <ReadPost
          editorState={postEditorState}
          onChange={setPostEditorState}
          postData={postData}
          topics={topics}
          title={title}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

export default PostPage;
