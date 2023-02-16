import React from "react";
import { Link } from "react-router-dom";

//Custom Hook
import useMediaQuery from "../../../shared/hooks/media-query-hook";

//CSS
import classes from "./PostInfoDescription.module.css";
import { useSelector } from "react-redux";

function PostInfoDescription(props) {
  const { postId, short, language } = props;

  //Redux
  const isDarkMode = useSelector((state) => state.theme.value);

  //Custom Hook
  const { matches } = useMediaQuery("min", "768");
  const limit = matches ? 125 : 50;

  if (short?.length < limit)
    return <div className={classes["container"]}>{short}</div>;

  //Count the description stop word
  let count = limit;
  for (let i = limit; short && short[i - 1] !== " " && i < limit + 50; i++) {
    count = i;
  }
  return (
    <div className={classes["container"]}>
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
  );
}

export default PostInfoDescription;
