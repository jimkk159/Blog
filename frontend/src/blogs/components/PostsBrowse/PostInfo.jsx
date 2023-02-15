import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//Image
import defaultCoverImage from "../../../assets/img/cover/default-cover-2.jpg";

//Custom Hook
import useHttp from "../../../shared/hooks/http-hook";

//Custom Function
import { options } from "../../util/time";
import { choiceLanguage } from "../../util/choiceLanguage";

//Custom Component
import PostInfoTitle from "./PostInfoTitle";
import Card from "../../../shared/components/UI/Card";
import PostInfoDescription from "./PostInfoDescription";
import ErrorModal from "../../../shared/components/UI/Modal/ErrorModal";
import DeleteModal from "../../../shared/components/UI/Modal/DeleteModal";
import LoadingSpinner from "../../../shared/components/UI/LoadingSpinner";

//CSS
import classes from "./PostInfo.module.css";

function PostInfo({ post, topic, onPin, onDelete }) {
  const {
    id: pid,
    topic: topicText,
    date,
    author_id,
    author,
    cover,
    content,
    tags,
    pin,
  } = post;

  const postTags = tags ? tags : [];
  const postContent = content;
  const postDate = new Date(date).toLocaleDateString("en-US", options);
  const topicCover = topic?.cover
    ? topic?.cover?.startsWith("https://") ||
      topic?.cover?.startsWith("http://")
      ? `${topic?.cover}`
      : `${process.env.REACT_APP_BACKEND_URL}/${topic?.cover}`
    : null;
  const postCover = cover
    ? cover.startsWith("https://") || cover.startsWith("http://")
      ? `${cover}`
      : `${process.env.REACT_APP_BACKEND_URL}/${cover}`
    : topicCover
    ? topicCover
    : defaultCoverImage;

  const [title, setTitle] = useState("No Title");
  const [showWarning, setShowWarning] = useState(false);
  const [short, setShort] = useState("No Description...");
  const [cardColor, setCardColor] = useState(classes["dark"]);

  //Custom Hook
  const { isLoading, error, sendRequest, clearError } = useHttp();

  //Redux
  const isDarkMode = useSelector((state) => state.theme.value);
  const { isEnglish, language } = useSelector((state) => state.language);

  //React Router
  const navigate = useNavigate();
  useEffect(() => {
    setCardColor(
      isDarkMode
        ? !!pin
          ? classes["dark-pin"]
          : classes["dark"]
        : !!pin
        ? classes["light-pin"]
        : classes["light"]
    );
  }, [pin, isDarkMode]);

  useEffect(() => {
    setTitle(
      choiceLanguage(
        isEnglish,
        postContent.en.title,
        postContent.ch.title,
        "No Title"
      )
    );
    setShort(
      choiceLanguage(
        isEnglish,
        postContent.en.short,
        postContent.ch.short,
        "No Description..."
      )
    );
  }, [isEnglish, postContent]);

  const navPostHandler = (event) => {
    //Double Click
    if (event.detail === 2) {
      navigate(`/blog/${pid}`);
    }
  };

  //Edit
  const editHandler = (event) => {
    event.stopPropagation();
    console.log("edit");
    navigate(`/blog/${pid}`, { state: { isEdit: true } });
  };

  //Delete
  const showDeleteHandler = (event) => {
    event.stopPropagation();
    console.log("delete");
    setShowWarning(true);
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <DeleteModal
        pid={pid}
        title={title}
        onDelete={onDelete}
        show={showWarning}
        setShow={setShowWarning}
        sendRequest={sendRequest}
      />
      <Card
        className={`${classes["info-container"]} ${cardColor}`}
        isDarkMode={isDarkMode}
        onClick={navPostHandler}
      >
        {isLoading && (
          <div className={classes["loading-content"]}>
            <h1>Deleteing...</h1>
            <LoadingSpinner asOverlay />
          </div>
        )}
        {!isLoading && (
          <div className={classes["info-content"]}>
            <h1>{`[ ${topicText ? topicText : "  "} ] ${title}`}</h1>
            <PostInfoTitle
              postId={pid}
              authorId={author_id}
              author={author}
              date={postDate}
              isPined={!!pin}
              onEdit={editHandler}
              onPin={onPin}
              onShowDelete={showDeleteHandler}
            />
            <hr />
            <div className={classes["description-container"]}>
              <img src={postCover} alt="blog-cover" />
              <PostInfoDescription
                postId={pid}
                short={short}
                tags={postTags}
                language={language}
              />
            </div>
          </div>
        )}
      </Card>
    </>
  );
}

export default PostInfo;
//reference:https://bobbyhadz.com/blog/react-double-click-event