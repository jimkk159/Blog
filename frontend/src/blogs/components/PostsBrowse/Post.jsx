import React from "react";
import { useSelector } from "react-redux";

//Custom Component
import PostInfo from "./PostInfo";
import PostDescription from "./PostDescription";
import Card from "../../../shared/components/UI/Card";

//CSS
import classes from "./Post.module.css";

function Post(props) {
  const isDarkMode = useSelector((state) => state.theme.value);
  const language = useSelector((state) => state.language.language);
  const backgroundColor =
    !isDarkMode &&
    (props.isOdd ? classes["light-blue"] : classes["light-green"]);

  return (
    <Card
      className={`${classes["info-container"]} ${backgroundColor}`}
      isDarkMode={isDarkMode}
    >
      <div className={classes["info-content"]}>
        <h1>{props.title}</h1>
        <PostInfo
          author={props.author}
          date={props.date}
          isPined={props.isPined}
        />
        <hr />
        <div className={classes["description-container"]}>
          <img src={props.image} alt="blog-cover" />
          <PostDescription
            description={props.description}
            tags={props.tags}
            language={language}
          />
        </div>
      </div>
    </Card>
  );
}

export default Post;
