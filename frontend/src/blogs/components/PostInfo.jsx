import React from "react";
import { Link } from "react-router-dom";

//Custom Component
import Card from "../../shared/components/UI/Card";

//Custom Hook
import useMediaQuery from "../../shared/hooks/media-query-hook";

//CSS
import classes from "./PostInfo.module.css";

function PostInfo(props) {
  const { description } = props;
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
        {description.slice(0, count) + "... "}
        <Link to="/blog">{"(more)"}</Link>
      </p>
    );
  }

  return (
    <Card className={classes["info-container"]} isDarkMode={props.isDarkMode}>
      <div className={classes["info-content"]}>
        <h1>{props.title}</h1>
        <p>Created by {props.author}&nbsp;&nbsp;&nbsp;</p>
        <p>{props.date}</p>
        <hr />
        <div className={classes["info-description"]}>
          <img src={props.image} alt="blog-cover" />
          {content}
        </div>
      </div>
    </Card>
  );
}

export default PostInfo;
