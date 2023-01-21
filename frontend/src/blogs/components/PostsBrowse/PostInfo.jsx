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
import Button from "../../../shared/components/Form/Button";
import ErrorModal from "../../../shared/components/UI/Modal/ErrorModal";
import WarningModal from "../../../shared/components/UI/Modal/WarningModal";
import LoadingSpinner from "../../../shared/components/UI/LoadingSpinner";

//CSS
import classes from "./PostInfo.module.css";

function PostInfo(props) {
  const { post, isOdd, onDelete } = props;
  const {
    id: postId,
    topic,
    date,
    author,
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
      navigate(`/blog/${postId}`, { state: { toLogin: true } });
    }
  };

  //Delete
  const showDeleteHandler = (event) => {
    event.stopPropagation();
    console.log("delete");
    setShowWarning(true);
  };

  const cancelDeleteHandler = () => {
    console.log("canacel");
    setShowWarning(false);
  };

  const confirmDeleteHandler = async () => {
    console.log("delete");
    setShowWarning(false);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/posts/${postId}`,
        "DELETE"
      );
      onDelete(postId);
    } catch (err) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <WarningModal
        show={showWarning}
        className={classes["warning-modal"]}
        onCancel={cancelDeleteHandler}
        header={"Warning!"}
        content={`Are you sure to delete 「${title}」?`}
        footer={
          <div className={classes["button-container"]}>
            <Button
              className={`${classes["button"]} ${classes["delete-btn"]}`}
              onClick={confirmDeleteHandler}
            >
              DELETE
            </Button>
            <Button
              className={`${classes["button"]} ${classes["cancel-btn"]}`}
              onClick={cancelDeleteHandler}
            >
              CANCEL
            </Button>
          </div>
        }
        isAnimate
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
              author={author}
              date={date}
              isPined={isPined}
              onShowDelete={showDeleteHandler}
            />
            <hr />
            <div className={classes["description-container"]}>
              <img src={postCover} alt="blog-cover" />
              <PostInfoDescription
                postId={postId}
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