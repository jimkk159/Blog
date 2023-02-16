import React from "react";
import { useNavigate } from "react-router-dom";

//CSS
import classes from "./RelatedArticle.module.css";

function RelatedArticle({ pid, title }) {
  const navigate = useNavigate();

  if (!title) return;

  const clickHandler = (event) => {
    event.stopPropagation();
    navigate(`/blog/${pid}`);
  };

  return (
    <li className={classes["list-item-container"]}>
      <div className={classes["list-item"]} onClick={clickHandler}>
        {title}
      </div>
    </li>
  );
}

export default RelatedArticle;
