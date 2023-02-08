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
import PostEditor from "../../blogs/components/PostEditor";

//CSS
import classes from "./NewPostPage.module.css";

function NewPostPage() {
  const [tags, setTags] = useState([]);
  const [topic, setTopic] = useState([]);
  const [topics, setTopics] = useState([]);
  const [topicTags, setTopicTags] = useState([]);
  const [postCover, setPostCover] = useState(null);
  const [titleState, setTitleState] = useState(() => EditorState.createEmpty());
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [tagsEditorState, setTagsEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  //Redux
  const { token } = useSelector((state) => state.auth);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isEnglish = useSelector((state) => state.language.isEnglish);

  //React Router
  const navigate = useNavigate();
  const { edit } = useOutletContext();
  const setIsEdit = edit[1];

  //Custom Hook
  const { isLoading, error, sendRequest, clearError } = useHttp();
  const {
    isLoading: isLoadingTopic,
    error: errorTopic,
    sendRequest: sendRequestTopic,
    clearError: clearErrorTopic,
  } = useHttp();

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

  //Save the Post Tags
  const savePostTagsHandler = () => {
    const currentContent = tagsEditorState.getCurrentContent();
    const contentBlock = currentContent.getFirstBlock();
    const tag = contentBlock.getText();
    return tag;
  };

  //Save the Post
  const savePostHandler = async () => {
    try {
      const title = savePostTitleHandler();
      const tag = savePostTagsHandler().trim();
      const newTags = tag ? [...tags, tag] : [...tags];
      const contentRawData = savePostContentHandler();
      const [imgBlobs, convertedData] = convertImgURL(contentRawData);
      const createSendForm = (imgArray, draftRawData) => {
        const formData = new FormData();
        formData.append("topic", JSON.stringify(topic));
        formData.append("title", title);
        formData.append("cover", postCover);
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
  };

  //Cancel the Post
  const cancelPostHandler = () => {
    navigate(-1);
  };

  //Create a Post need to Login
  useEffect(() => {
    if (!isLoggedIn) navigate(`/`);
  }, [isLoggedIn, navigate]);

  //GET Topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const responseData = await sendRequestTopic(
          process.env.REACT_APP_BACKEND_URL + "/topics"
        );
        const topicsTags = responseData.map((item) => {
          return item.name;
        });
        const topics = responseData.map((item) => ({
          ...item,
          parent: "",
          children: [],
        }));

        //Setting parent and children
        for (let i = 0; i < topics.length; i++) {
          for (let j = 0; j < topics.length; j++) {
            if (i === j) continue;
            if (topics[i].parent_id === topics[j].id) {
              topics[i].parent = topics[j].name;
              topics[j].children.push(topics[i].name);
            }
          }
        }
        setTopics(topics);
        setTopicTags(topicsTags);
      } catch (err) {}
    };
    fetchTopics();
  }, [sendRequestTopic]);

  useEffect(() => {
    setIsEdit(true);
  }, [setIsEdit]);

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
        tags={tags}
        topic={topic}
        topics={topics}
        topicTags={topicTags}
        onTags={setTags}
        onTopic={setTopic}
        editorState={editorState}
        onChange={setEditorState}
        titleState={titleState}
        onChangeTitle={setTitleState}
        tagsState={tagsEditorState}
        onChangeTags={setTagsEditorState}
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
