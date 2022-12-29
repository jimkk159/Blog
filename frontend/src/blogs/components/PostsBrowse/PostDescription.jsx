import React from "react";
import { Link } from "react-router-dom";

//Custom Hook
import useMediaQuery from "../../../shared/hooks/media-query-hook";

//Custom Component
import Tags from "../../../shared/components/UI/Tags";

//CSS
import classes from "./PostDescription.module.css";
import { useSelector } from "react-redux";

function PostDescription(props) {
  const { description, tags } = props;

  //Redux
  const isDarkMode = useSelector((state) => state.theme.value);

  //Tag Content
  const tagContent = <Tags isDarkMode={isDarkMode} content={tags} />;

  //Custom Hook
  const { matches } = useMediaQuery("min", "768");
  const limit = matches ? 200 : 150;
  if (description.length < limit)
    return (
      <div className={classes["detail-container"]}>
        <div className={classes["detail-upper"]}>{description}</div>{" "}
        {tagContent}
      </div>
    );

  //Count the description stop word
  let count = limit;
  for (let i = limit; description[i - 1] !== " " && i < limit + 50; i++) {
    count = i;
  }
  return (
    <div className={classes["detail-container"]}>
      <div className={classes["detail-upper"]}>
        <p>
          {description.slice(0, count) + "... ( "}
          <Link
            to="/blog"
            className={
              isDarkMode ? classes["link-yellow"] : classes["link-green"]
            }
          >
            {"more"}
          </Link>
          {" )"}
        </p>
      </div>
      {tagContent}
    </div>
  );
}

export default PostDescription;
