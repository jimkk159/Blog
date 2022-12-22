import React from "react";
import { Link } from "react-router-dom";

//Custom Component
import PostInfo from "./PostInfo";
import Card from "../../shared/components/UI/Card";

//Custom Hook
import useMediaQuery from "../../shared/hooks/media-query-hook";

//CSS
import classes from "./Post.module.css";

function Post(props) {
  const { description } = props;
  const backgroundColor =
    !props.isDarkMode &&
    (props.isOdd ? classes["light-blue"] : classes["light-green"]);
  let content = description;

  //Custom Hook
  const { matches } = useMediaQuery("min", "768");
  const limit = matches ? 200 : 150;
  if (description.length > limit) {
    let count = limit;
    for (let i = limit; description[i - 1] !== " " && i < limit + 50; i++) {
      count = i;
    }
    content = (
      <p>
        {description.slice(0, count) + "... ( "}
        <Link
          to="/blog"
          className={
            props.isDarkMode ? classes["link-yellow"] : classes["link-blue"]
          }
        >
          {"more"}
        </Link>
        {" )"}
      </p>
    );
  }

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
          isDarkMode={props.isDarkMode}
        />
        <hr />
        <div className={classes["info-description"]}>
          <img src={props.image} alt="blog-cover" />
          {content}
        </div>
      </div>
    </Card>
  );
}

export default Post;
