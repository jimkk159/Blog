import React from "react";

//Custom Component
import PostInfo from "./PostInfo";
import PostDescription from "./PostDescription";
import Card from "../../shared/components/UI/Card";

//CSS
import classes from "./Post.module.css";

function Post(props) {
  const backgroundColor =
    !props.isDarkMode &&
    (props.isOdd ? classes["light-blue"] : classes["light-green"]);

  return (
    <Card
      className={`${classes["info-container"]} ${backgroundColor}`}
      isDarkMode={props.isDarkMode}
    >
      <div className={classes["info-content"]}>
        <h1>{props.title}</h1>
        <PostInfo
          author={props.author}
          date={props.date}
          isPined={props.isPined}
          isDarkMode={props.isDarkMode}
        />
        <hr />
        <div className={classes["description-container"]}>
          <img src={props.image} alt="blog-cover" />
          <PostDescription
            description={props.description}
            tags={props.tags}
            isDarkMode={props.isDarkMode}
          />
        </div>
      </div>
    </Card>
  );
}

export default Post;
