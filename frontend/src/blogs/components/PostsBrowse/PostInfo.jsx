import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//Image
import defaultCoverImage from "../../../assets/img/cover/default-cover-2.jpg";

//Custom Function
import { options } from "../../util/time";
import { choiceLanguage } from "../../util/choiceLanguage";

//Custom Component
import PostInfoTitle from "./PostInfoTitle";
import Tags from "../../../shared/components/UI/Tags";
import Card from "../../../shared/components/UI/Card";
import PostInfoDescription from "./PostInfoDescription";
import DeleteModal from "../../../shared/components/UI/Modal/DeleteModal";

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
    navigate(`/blog/${pid}`, { state: { isEdit: true, collapse: true } });
  };

  //Delete
  const showDeleteHandler = (event) => {
    event.stopPropagation();
    console.log("delete");
    setShowWarning(true);
  };

  return (
    <>
      <DeleteModal
        pid={pid}
        title={title}
        onDelete={onDelete}
        show={showWarning}
        setShow={setShowWarning}
      />
      <Card
        className={`${classes["info-container"]} ${cardColor}`}
        isDarkMode={isDarkMode}
        onClick={navPostHandler}
      >
        <div className={classes["info-content"]}>
          <div className={classes["cover"]}>
            <img src={postCover} alt="blog-cover" />
          </div>
          <div className={classes["description"]}>
            <h2>{`[ ${topicText ? topicText : "  "} ] ${title}`}</h2>
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
            <PostInfoDescription
              postId={pid}
              short={short}
              tags={postTags}
              language={language}
            />
            <Tags isDarkMode={isDarkMode} content={tags} />
          </div>
        </div>
      </Card>
    </>
  );
}

export default PostInfo;
//reference:https://bobbyhadz.com/blog/react-double-click-event
