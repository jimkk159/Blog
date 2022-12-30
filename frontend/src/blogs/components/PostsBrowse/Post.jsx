import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//Image
import defaultCoverImage from "../../../assets/img/cover/default-cover-2.jpg";

//Custom Function
import { choiceLanguage } from "../../util/choiceLanguage";

//Custom Component
import PostInfo from "./PostInfo";
import PostDescription from "./PostDescription";
import Card from "../../../shared/components/UI/Card";

//CSS
import classes from "./Post.module.css";

function Post(props) {
  const {
    postId,
    language: postLanguage,
    author,
    date,
    cover,
    isPined,
    isOdd,
    tags,
  } = props;
  const postCover = cover.img ? cover.img : defaultCoverImage;
  //React Router
  const navigate = useNavigate();
  //Redux
  const isDarkMode = useSelector((state) => state.theme.value);
  const { isEnglish, language } = useSelector((state) => state.language);
  const backgroundColor = isDarkMode
    ? classes["dark"]
    : isOdd
    ? classes["light-blue"]
    : classes["light-green"];
  const title = choiceLanguage(
    isEnglish,
    postLanguage.en.title,
    postLanguage.ch.title,
    "No Title"
  );
  const short = choiceLanguage(
    isEnglish,
    postLanguage.en.short,
    postLanguage.ch.short,
    "No Description..."
  );
  const navPostHandler = () => {
    navigate(`/blog/${postId}`, { state: { toLogin: true } });
  };

  return (
    <Card
      className={`${classes["info-container"]} ${backgroundColor}`}
      isDarkMode={isDarkMode}
      onClick={navPostHandler}
    >
      <div className={classes["info-content"]}>
        <h1>{title}</h1>
        <PostInfo author={author} date={date} isPined={isPined} />
        <hr />
        <div className={classes["description-container"]}>
          <img src={postCover} alt="blog-cover" />
          <PostDescription
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

export default Post;
