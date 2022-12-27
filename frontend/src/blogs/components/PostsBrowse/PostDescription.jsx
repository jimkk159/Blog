import React from "react";
import { Link } from "react-router-dom";

//Icon
import { AiOutlineTag } from "react-icons/ai";

//Custom Hook
import useMediaQuery from "../../../shared/hooks/media-query-hook";

//CSS
import classes from "./PostDescription.module.css";
import { useSelector } from "react-redux";

function PostDescription(props) {
  const { description, tags } = props;

  //Redux
  const isDarkMode = useSelector((state) => state.theme.value);
  
  //Tag Content
  const tagContent = (
    <div className={classes["detail-bottom"]}>
      <AiOutlineTag className={classes["icon"]} />
      {tags.map((tag, index) => (
        <p
          key={index}
          className={`${isDarkMode ? classes["dark"] : classes["light"]}`}
        >
          {tag}
        </p>
      ))}
    </div>
  );

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
