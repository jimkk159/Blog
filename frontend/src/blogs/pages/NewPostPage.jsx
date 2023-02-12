import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import { EditorState, convertToRaw } from "draft-js";

//Redux Slice
import { postActions } from "../../store/post-slice";

//Custom Function
import convertImgURL from "../../shared/util/url-to-blob";

//Custom Hook
import useHttp from "../../shared/hooks/http-hook";

//Custom Component
import Button2 from "../../shared/components/Form/Button2";
import Backdrop from "../../shared/components/UI/Backdrop";
import ErrorModal from "../../shared/components/UI/Modal/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import PostEditor from "../../blogs/components/PostEditor";

//CSS
import classes from "./NewPostPage.module.css";
import useAutoSave from "../../shared/hooks/save-post-hook";

function NewPostPage() {
  const [topics, setTopics] = useState([]);
  const [cover, setCover] = useState(null);
  const [titleState, setTitleState] = useState(() => EditorState.createEmpty());
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [tagState, setTagState] = useState(() => EditorState.createEmpty());

  //Redux
  const { topic, parent, children, tags } = useSelector((state) => state.post);
  const { token } = useSelector((state) => state.auth);
  const isEnglish = useSelector((state) => state.language.isEnglish);
  const dispatch = useDispatch();

  //React Router
  const navigate = useNavigate();
  const { edit } = useOutletContext();
  const [setIsEdit] = edit[1];

  //Custom Hook
  const { isLoading, error, sendRequest, clearError } = useHttp();
  const {
    isLoading: isLoadingTopic,
    error: errorTopic,
    sendRequest: sendRequestTopic,
    clearError: clearErrorTopic,
  } = useHttp();
  
  //Get EditorState FirstBlock Text
  const getTextHandler = useCallback((editorState) => {
    const currentContent = editorState.getCurrentContent();
    const contentBlock = currentContent.getFirstBlock();
    return contentBlock.getText();
  }, []);

  //Save the Post Editor
  const savePostContentHandler = useCallback((editorState) => {
    const currentContent = editorState.getCurrentContent();
    return JSON.stringify(convertToRaw(currentContent));
  }, []);

  //Save the Post
  const savePostHandler = useCallback(
    async (token) => {
      try {
        if (!token) return;
        const title = getTextHandler(titleState);
        const tag = getTextHandler(tagState).trim();
        const newTags = tag ? [...tags, tag] : [...tags];
        const contentRawData = savePostContentHandler(editorState);
        const [imgBlobs, convertedData] = convertImgURL(contentRawData);
        const createSendForm = (imgArray, draftRawData) => {
          const formData = new FormData();
          formData.append("topic", JSON.stringify({ topic, parent, children }));
          formData.append("title", title);
          formData.append("cover", cover);
          formData.append("language", isEnglish ? "en" : "ch");
          formData.append("contentState", draftRawData);
          for (let i = 0; i < imgArray.length; i++) {
            formData.append("images", imgArray[i]);
          }
          for (let i = 0; i < newTags.length; i++) {
            formData.append("tags", newTags[i]);
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
    },
    [
      topic,
      parent,
      children,
      tags,
      setIsEdit,
      isEnglish,
      cover,
      titleState,
      editorState,
      tagState,
      navigate,
      sendRequest,
      getTextHandler,
      savePostContentHandler,
    ]
  );

  //Cancel the Post
  const cancelPostHandler = () => {
    navigate(-1);
  };

  //GET Topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const responseData = await sendRequestTopic(
          process.env.REACT_APP_BACKEND_URL + "/topics"
        );
        const rawTopics = responseData.map((item) => ({
          ...item,
          parent: "",
          children: [],
        }));

        //Setting parent and children
        for (let i = 0; i < rawTopics.length; i++) {
          for (let j = 0; j < rawTopics.length; j++) {
            if (i === j) continue;
            if (rawTopics[i].parent_id === rawTopics[j].id) {
              rawTopics[i].parent = rawTopics[j].topic;
              rawTopics[j].children.push(rawTopics[i].topic);
            }
          }
        }
        setTopics(rawTopics);
      } catch (err) {}
    };
    fetchTopics();
  }, [sendRequestTopic]);

  useEffect(() => {
    dispatch(postActions.reset());
    setIsEdit(true);
  }, [setIsEdit, dispatch]);

  //Custom Hook
  useAutoSave(savePostHandler);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <ErrorModal error={errorTopic} onClear={clearErrorTopic} />
      {(isLoading || isLoadingTopic) && (
        <>
          <Backdrop />
          <div className={`${classes["loading-container"]}`}>
            <LoadingSpinner asOverlay />
          </div>
        </>
      )}
      <PostEditor
        topics={topics}
        editorState={editorState}
        onChange={setEditorState}
        titleState={titleState}
        onChangeTitle={setTitleState}
        tagState={tagState}
        onChangeTag={setTagState}
        onCover={setCover}
      />
      <div className={`${classes["btn-container"]}`}>
        <Button2
          className={`${classes["btn"]}`}
          disabled={isLoading}
          onClick={() => savePostHandler(token)}
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
