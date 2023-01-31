import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//Image
import defaultCoverImage from "../../../assets/img/cover/default-cover-2.jpg";

//Custom Hook
import useHttp from "../../../shared/hooks/http-hook";

//Custom Function
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

function PostInfo(props) {
  const { post, isOdd, onDelete } = props;
  const {
    id: pid,
    topic,
    date,
    authorId,
    authorName,
    cover,
    language: postLanguage,
    tags,
    isPined,
  } = post;
  const postCover = cover.img ? cover.img : defaultCoverImage;

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
        ? classes["dark"]
        : isOdd
        ? classes["light-blue"]
        : classes["light-green"]
    );
  }, [isOdd, isDarkMode]);

  useEffect(() => {
    setTitle(
      choiceLanguage(
        isEnglish,
        postLanguage.en.title,
        postLanguage.ch.title,
        "No Title"
      )
    );
    setShort(
      choiceLanguage(
        isEnglish,
        postLanguage.en.short,
        postLanguage.ch.short,
        "No Description..."
      )
    );
  }, [isEnglish, postLanguage]);

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
            <h1>{`[ ${topic ? topic : "  "} ] ${title}`}</h1>
            <PostInfoTitle
              postId={pid}
              authorId={authorId}
              authorName={authorName}
              date={date}
              isPined={isPined}
              onEdit={editHandler}
              onShowDelete={showDeleteHandler}
            />
            <hr />
            <div className={classes["description-container"]}>
              <img src={postCover} alt="blog-cover" />
              <PostInfoDescription
                postId={pid}
                short={short}
                tags={tags}
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
