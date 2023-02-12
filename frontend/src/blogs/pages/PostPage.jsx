import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useOutletContext } from "react-router";
import {
  EditorState,
  ContentState,
  convertToRaw,
  convertFromRaw,
} from "draft-js";

//Redux Slice
import { postActions } from "../../store/post-slice";

//Custom Function
import { choiceLanguage } from "../util/choiceLanguage";
import convertImgURL from "../../shared/util/url-to-blob";

//Custom Hook
import useHttp from "../../shared/hooks/http-hook";

//Custom Comonent
import ReadPost from "../components/ReadPost";
import EditPost from "../components/EditPost";
import Backdrop from "../../shared/components/UI/Backdrop";
import ErrorModal from "../../shared/components/UI/Modal/ErrorModal";
import DeleteModal from "../../shared/components/UI/Modal/DeleteModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";

//CSS
import classes from "./PostPage.module.css";

function PostPage() {
  const [post, setPost] = useState(null);
  const [topicId, setTopicId] = useState(null);
  const [cover, setCover] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [prevToken, setPrevToken] = useState(null);

  //Post Topic
  const [topic, setTopic] = useState(null);
  const [topics, setTopics] = useState([]);

  //Post Title
  const [titleState, setTitleState] = useState(() => EditorState.createEmpty());

  //Post Content
  const [originState, setOriginState] = useState(null);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  //Post Tags
  const [tags, setTags] = useState([]);
  const [tagState, setTagState] = useState(() => EditorState.createEmpty());

  //Todo POst and postCover
  //Todo auto logout and save the post on New and Edit
  //Todo checking edit and then cancel is right (originstate)
  //Redux
  const { token, isLoggedIn } = useSelector((state) => state.auth);
  const isEnglish = useSelector((state) => state.language.isEnglish);
  const dispatch = useDispatch();

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
  const postId = post?.id;
  const savePostHandler = useCallback(
    async (token) => {
      try {
        if (!postId) return;
        const title = getTextHandler(titleState);
        const tag = getTextHandler(tagState).trim();
        const newTags = tag ? [...tags, tag] : [...tags];
        const contentRawData = savePostContentHandler(editorState);
        const [imgBlobs, convertedData] = convertImgURL(contentRawData);
        const createSendForm = (imgArray, draftRawData) => {
          const formData = new FormData();
          formData.append("topic", JSON.stringify(topic));
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
        await sendRequestSave(
          process.env.REACT_APP_BACKEND_URL + `/posts/${postId}`,
          "PUT",
          sendForm,
          {
            Authorization: "Bearer " + token,
          }
        );
        setCover(null);
        setIsEdit(false);
        setOriginState(editorState);
        dispatch(postActions.save());
      } catch (err) {}
    },
    [
      topic,
      tags,
      postId,
      isEnglish,
      setIsEdit,
      cover,
      titleState,
      tagState,
      editorState,
      dispatch,
      sendRequestSave,
      getTextHandler,
      savePostContentHandler,
    ]
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
        const postLanguage = JSON.parse(responseData?.language);
        let titleText = choiceLanguage(
          isEnglish,
          postLanguage?.en?.title,
          postLanguage?.ch?.title,
          ""
        );
        titleText = titleText ? titleText : "";
        const postJSON = JSON.parse(
          choiceLanguage(
            isEnglish,
            postLanguage?.en?.contentState,
            postLanguage?.ch?.contentState,
            EditorState.createEmpty()
          )
        );
        const postTags = JSON.parse(responseData.tags);
        setPost(responseData);
        const postContentState = convertFromRaw(postJSON);
        setOriginState(EditorState.createWithContent(postContentState));
        setEditorState(EditorState.createWithContent(postContentState));
        setTitleState(
          EditorState.createWithContent(ContentState.createFromText(titleText))
        );
        setTopicId(responseData.topic_id);
        dispatch(postActions.setUrl({ url: responseData.cover }));
        setTags(postTags);
      } catch (err) {}
    };
    fetchPost();
  }, [isEnglish, blogId, dispatch, setEditorState, sendRequest]);

  useEffect(() => {
    const targetTopic = topics.filter((topic) => topic.id === topicId)[0];
    if (targetTopic) {
      setTopic({
        topic: targetTopic?.topic,
        parent: targetTopic?.parent,
        children: targetTopic?.children,
      });
    }
  }, [topicId, topics]);

  //Rember the previous token when auto logout to save the post
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
      <ErrorModal error={errorSave} onClear={clearErrorSave} isAnimate />
      <ErrorModal error={errorTopic} onClear={clearErrorTopic} isAnimate />
      {(isLoading || isLoadingSave || isLoadingTopic) && (
        <>
          <Backdrop />
          <div className={`${classes["loading-container"]}`}>
            <LoadingSpinner asOverlay />
          </div>
        </>
      )}
      <DeleteModal
        pid={post?.id}
        title={getTextHandler(titleState)}
        show={showWarning}
        setShow={setShowWarning}
        sendRequest={sendRequest}
      />
      {isEdit ? (
        <EditPost
          token={token}
          topic={topic}
          topics={topics}
          onTopic={setTopic}
          titleState={titleState}
          onChangeTitle={setTitleState}
          originState={originState}
          editorState={editorState}
          onChange={setEditorState}
          tags={tags}
          onTags={setTags}
          tagState={tagState}
          onChangeTag={setTagState}
          onRead={readModeHandler}
          onSave={savePostHandler}
          onDelete={showDeleteHandler}
          onCover={setCover}
          isLoading={isLoadingSave || isLoadingTopic}
        />
      ) : (
        <ReadPost
          tagsClassName={classes["tags-container"]}
          title={getTextHandler(titleState)}
          topics={topics}
          cover={cover}
          post={post}
          tags={tags}
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
