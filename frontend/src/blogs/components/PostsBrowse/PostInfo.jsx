import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//Image
import defaultCoverImage from "../../../assets/img/cover/default-cover-2.jpg";

//Custom Function
import { choiceLanguage } from "../../util/choiceLanguage";

//Custom Component
import PostInfoTitle from "./PostInfoTitle";
import PostInfoDescription from "./PostInfoDescription";
import Card from "../../../shared/components/UI/Card";

//CSS
import classes from "./PostInfo.module.css";

function PostInfo(props) {
  const { post, isOdd } = props;
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

  const navPostHandler = () => {
    navigate(`/blog/${postId}`, { state: { toLogin: true } });
  };

  return (
    <Card
      className={`${classes["info-container"]} ${cardColor}`}
      isDarkMode={isDarkMode}
      onClick={navPostHandler}
    >
      <div className={classes["info-content"]}>
        <h1>{`[ ${topic ? topic : "  "} ] ${title}`}</h1>
        <PostInfoTitle author={author} date={date} isPined={isPined} />
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
    </Card>
  );
}

export default PostInfo;
