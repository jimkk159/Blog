import React from "react";
import { Link } from "react-router-dom";

//Custom Hook
import useMediaQuery from "../../../shared/hooks/media-query-hook";

//Custom Component
import Tags from "../../../shared/components/UI/Tags";

//CSS
import classes from "./PostInfoDescription.module.css";
import { useSelector } from "react-redux";

function PostInfoDescription(props) {
  const { postId, short, tags, language } = props;

  //Redux
  const isDarkMode = useSelector((state) => state.theme.value);

  //Tag Content
  const tagContent = <Tags isDarkMode={isDarkMode} content={tags} />;

  //Custom Hook
  const { matches } = useMediaQuery("min", "768");
  const limit = matches ? 200 : 150;
  if (short?.length < limit)
    return (
      <div className={classes["detail-container"]}>
        <div className={classes["detail-upper"]}>{short}</div> {tagContent}
      </div>
    );

  //Count the description stop word
  let count = limit;
  for (let i = limit; short && short[i - 1] !== " " && i < limit + 50; i++) {
    count = i;
  }
  return (
    <div className={classes["detail-container"]}>
      <div className={classes["detail-upper"]}>
        <p>
          {short?.slice(0, count) + "... ( "}
          <Link
            to={`/blog/${postId}`}
            className={
              isDarkMode ? classes["link-yellow"] : classes["link-green"]
            }
          >
            {language.continue}
          </Link>
          {" )"}
        </p>
      </div>
      {tagContent}
    </div>
  );
}

export default PostInfoDescription;