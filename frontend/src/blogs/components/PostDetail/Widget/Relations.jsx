import React from "react";
import { useSelector } from "react-redux";

//Custom Function
import { choiceLanguage } from "../../../util/choiceLanguage";

//Custom Component
import RelatedArticle from "./RelatedArticle";

//CSS
import classes from "./Relations.module.css";

function Relations({ related }) {
  const isEnglish = useSelector((state) => state.language.isEnglish);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <>
      <h1
        className={`${classes["title"]} ${
          isDarkMode ? classes["dark"] : classes["light"]
        }`}
      >
        {isEnglish ? "Related Articles" : "相關文章"}
      </h1>
      <ul className={classes["list-items"]}>
        {related.map((post, index) => {
          const title = choiceLanguage(isEnglish, post?.en, post?.ch, null);
          return <RelatedArticle key={index} pid={post.id} title={title} />;
        })}
      </ul>
    </>
  );
}

export default Relations;
