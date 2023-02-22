import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useOutletContext } from "react-router";
import { EditorState, convertToRaw } from "draft-js";

//Redux Slice
import { postActions } from "../../store/post-slice";
import { topicActions } from "../../store/topic-slice";

//Custom Function
import convertImgURL from "../../shared/util/url-to-blob";

//Custom Hook
import useHttp from "../../shared/hooks/http-hook";
import usePost from "../../shared/hooks/get-post-hook";
import useTopic from "../../shared/hooks/get-topic-hook";
import useAutoSave from "../../shared/hooks/save-post-hook";

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
  const [cover, setCover] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  //Post Tags
  const [tagState, setTagState] = useState(() => EditorState.createEmpty());

  //Redux
  const uid = useSelector((state) => state.auth.uid);
  const isEnglish = useSelector((state) => state.language.isEnglish);
  const { parent, children } = useSelector((state) => state.topic);
  const { authorId, tags } = useSelector((state) => state.post);
  const { topic } = useSelector((state) => state.topic);

  const dispatch = useDispatch();

  //React Router
  const { pid } = useParams();
  const { edit } = useOutletContext();
  const [isEdit, setIsEdit] = edit;

  //Custom Hook
  const {
    isLoading: isLoadingSave,
    error: errorSave,
    sendRequest: sendRequestSave,
    clearError: clearErrorSave,
  } = useHttp();
  const {
    fetchTopics,
    isLoading: isLoadingTopic,
    error: errorTopic,
    clearError: clearErrorTopic,
  } = useTopic();
  const {
    fetchPost,
    isLoading: isLoadingPost,
    error: errorPost,
    clearError: clearErrorPost,
    shortState,
    setShortState,
    titleState,
    setTitleState,
    originState,
    setOriginState,
    editorState,
    setEditorState,
  } = usePost();
  const isLoading = isLoadingTopic || isLoadingPost || isLoadingSave;

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
  const savePostHandler = useCallback(
    async (token) => {
      try {
        if (!pid || !token || authorId !== uid) return;
        const title = getTextHandler(titleState);
        const type = "Problem";
        const short = getTextHandler(shortState);
        const tag = getTextHandler(tagState).trim();
        const newTags = tag ? [...tags, tag] : [...tags];
        const contentRawData = savePostContentHandler(editorState);
        const [convertedData, imgBlobs, imgMap] = convertImgURL(contentRawData);
        const createSendForm = (imgMap, imgArray, draftRawData, tags) => {
          const formData = new FormData();
          formData.append("topic", topic);
          formData.append("parent", parent);
          formData.append("type", type);
          formData.append("cover", cover);
          formData.append("language", isEnglish ? "en" : "ch");
          formData.append("title", title);
          formData.append("short", short);
          formData.append("content", draftRawData);
          for (let i = 0; i < children.length; i++) {
            formData.append("children", children[i]);
          }
          for (let i = 0; i < imgMap.length; i++) {
            formData.append("map", imgMap[i]);
          }
          for (let i = 0; i < imgArray.length; i++) {
            formData.append("images", imgArray[i]);
          }
          for (let i = 0; i < tags.length; i++) {
            formData.append("tags", tags[i]);
          }
          return formData;
        };
        const sendForm = createSendForm(
          imgMap,
          imgBlobs,
          convertedData,
          newTags
        );
        await sendRequestSave(
          process.env.REACT_APP_BACKEND_URL + `/posts/${pid}`,
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
        dispatch(topicActions.save());
      } catch (err) {}
    },
    [
      uid,
      authorId,
      pid,
      topic,
      parent,
      children,
      tags,
      isEnglish,
      setIsEdit,
      cover,
      shortState,
      titleState,
      tagState,
      editorState,
      dispatch,
      setOriginState,
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

  //GET POST
  useEffect(() => {
    console.log("GET POST Edit");
    (async function fetch() {
      const topics = await fetchTopics();
      const post = await fetchPost(pid);

      if (topics.length > 0 && post) {
        const topic = topics.filter((topic) => topic.id === post.topic_id)[0];
        dispatch(
          topicActions.setInit({
            id: topic.id,
            topic: topic.topic,
            parent: topic.parent,
            children: [...topic.children],
            cover: topic.cover,
          })
        );
      }
    })();
  }, [pid, dispatch, fetchTopics, fetchPost]);

  //Custom Hook
  useAutoSave(savePostHandler);

  return (
    <>
      <ErrorModal error={errorTopic} onClear={clearErrorTopic} isAnimate />
      <ErrorModal error={errorPost} onClear={clearErrorPost} isAnimate />
      <ErrorModal error={errorSave} onClear={clearErrorSave} isAnimate />
      {isLoading && (
        <>
          <Backdrop />
          <div className={`${classes["loading-container"]}`}>
            <LoadingSpinner asOverlay />
          </div>
        </>
      )}
      <DeleteModal
        pid={pid}
        title={getTextHandler(titleState)}
        show={showWarning}
        setShow={setShowWarning}
      />
      {isEdit ? (
        <EditPost
          shortState={shortState}
          onChangeShort={setShortState}
          titleState={titleState}
          onChangeTitle={setTitleState}
          originState={originState}
          editorState={editorState}
          onChange={setEditorState}
          tagState={tagState}
          onChangeTag={setTagState}
          onRead={readModeHandler}
          onSave={savePostHandler}
          onDelete={showDeleteHandler}
          onCover={setCover}
          isLoading={isLoading}
        />
      ) : (
        <ReadPost
          tagsClassName={classes["tags-container"]}
          title={getTextHandler(titleState)}
          editorState={editorState}
          onChange={setEditorState}
          onEdit={editModeHandler}
          onDelete={showDeleteHandler}
          isLoading={isLoading}
        />
      )}
    </>
  );
}

export default PostPage;
