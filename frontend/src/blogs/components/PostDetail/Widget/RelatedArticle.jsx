import React from "react";

//CSS
import classes from "./RelatedArticle.module.css";

function RelatedArticle({ title }) {
  if (!title) return;
  return <li className={classes["list-item"]}>{title}</li>;
}

export default RelatedArticle;
