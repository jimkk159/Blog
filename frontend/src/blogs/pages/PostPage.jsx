import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useOutletContext } from "react-router";
import {
  EditorState,
  ContentState,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import { createEditorStateWithText } from "@draft-js-plugins/editor";

//Redux Slice
import { postActions } from "../../store/post-slice";

//Custom Function
import { choiceLanguage } from "../util/choiceLanguage";
import convertImgURL from "../../shared/util/url-to-blob";

//Custom Hook
import useHttp from "../../shared/hooks/http-hook";
import useTopic from "../../shared/hooks/get-topics-hook";

//Custom Comonent
import ReadPost from "../components/ReadPost";
import EditPost from "../components/EditPost";
import Backdrop from "../../shared/components/UI/Backdrop";
import ErrorModal from "../../shared/components/UI/Modal/ErrorModal";
import DeleteModal from "../../shared/components/UI/Modal/DeleteModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";

//CSS
import classes from "./PostPage.module.css";
import useAutoSave from "../../shared/hooks/save-post-hook";

function PostPage() {
  const [cover, setCover] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  //Post Title
  const [titleState, setTitleState] = useState(() => EditorState.createEmpty());
  //Post Content
  const [originState, setOriginState] = useState(null);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  //Post Tags
  const [tagState, setTagState] = useState(() => EditorState.createEmpty());

  //Redux
  const uid = useSelector((state) => state.auth.uid);
  const isEnglish = useSelector((state) => state.language.isEnglish);
  const { topic, topicId, authorId, parent, children, tags } = useSelector(
    (state) => state.post
  );

  const dispatch = useDispatch();

  //React Router
  const { pid } = useParams();
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
    topics,
    isLoading: isLoadingTopic,
    error: errorTopic,
    clearError: clearErrorTopic,
  } = useTopic();

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
        const short = "bra bra bra";
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

  //GET POST
  useEffect(() => {
    console.log("GET POST Edit");
    const fetchPost = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/posts/${pid}`
        );
        const postContent = responseData?.content;

        let titleText = choiceLanguage(
          isEnglish,
          postContent?.en?.title,
          postContent?.ch?.title,
          ""
        );
        titleText = titleText ? titleText : "";
        let enContent;
        try {
          enContent = JSON.parse(postContent?.en?.content);
        } catch (err) {
          enContent = null;
        }
        let chContent;
        try {
          chContent = JSON.parse(postContent?.ch?.content);
        } catch (err) {
          chContent = null;
        }
        const postJSON = choiceLanguage(
          isEnglish,
          enContent,
          chContent,
          convertToRaw(ContentState.createFromText(""))
        );
        const postContentState = convertFromRaw(postJSON);
        setOriginState(EditorState.createWithContent(postContentState));
        setEditorState(EditorState.createWithContent(postContentState));
        setTitleState(createEditorStateWithText(titleText));
        const responseCover = responseData.cover;
        const cover = responseCover
          ? responseCover.startsWith("https://") ||
            responseCover.startsWith("http://") ||
            responseCover.startsWith("data:image")
            ? `${responseCover}`
            : `${process.env.REACT_APP_BACKEND_URL}/${responseCover}`
          : null;
        dispatch(
          postActions.setInit({
            id: responseData.id,
            date: responseData.date,
            authorId: responseData.author_id,
            author: responseData.author,
            avatar: responseData.avatar,
            topicId: responseData.topic_id,
            pin: responseData.pin,
            url: cover,
            related: responseData.related,
            tags: responseData.tags,
          })
        );
      } catch (err) {}
    };
    fetchPost();
  }, [isEnglish, pid, dispatch, setEditorState, sendRequest]);

  useEffect(() => {
    const topic = topics.filter((topic) => topic.id === topicId)[0];
    if (topic) {
      dispatch(
        postActions.setInitTopic({
          topic: topic?.topic,
          parent: topic?.parent,
          children: topic?.children,
          cover: topic?.cover,
        })
      );
    }
  }, [topicId, topics, dispatch]);

  //Custom Hook
  useAutoSave(savePostHandler);

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
        pid={pid}
        title={getTextHandler(titleState)}
        show={showWarning}
        setShow={setShowWarning}
        sendRequest={sendRequest}
      />
      {isEdit ? (
        <EditPost
          topics={topics}
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
          isLoading={isLoadingSave || isLoadingTopic}
        />
      ) : (
        <ReadPost
          tagsClassName={classes["tags-container"]}
          topics={topics}
          title={getTextHandler(titleState)}
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
