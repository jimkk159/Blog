import React from "react";
import { useSelector } from "react-redux";

//Custom Comonent
import Guide from "../components/BlogGuide/Guide";
import Card from "../../shared/components/UI/Card";

//CSS
import classes from "./PostPage.module.css";

//Dummy Data
import { Dummy_blogs } from "../../Dummy_blogs";

function PostPage() {
  const isDarkMode = useSelector((state) => state.theme.value);
  const { title, description, cover } = Dummy_blogs[0];

  return (
    <div className={classes["flex-container"]}>
      <Card className="page" isDarkMode={isDarkMode}>
        <h1>{title}</h1>
        <img src={cover} alt={"Post Cover"} />
        <p>{description}</p>
      </Card>
      <Guide isDarkMode={isDarkMode} />
    </div>
  );
}

export default PostPage;
