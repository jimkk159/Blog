import React from "react";
import { useSelector } from "react-redux";

//Custom Comonent
import Card from "../../shared/components/UI/Card";

//Dummy Data
import { Dummy_blogs } from "../../Dummy_blogs";

function PostPage() {
  const isDarkMode = useSelector((state) => state.theme.value);
  const { title, description, cover } = Dummy_blogs[0];
  return (
    <>
      <Card className="page" isDarkMode={isDarkMode}>
        <h1>{title}</h1>
        <img src={cover} alt={"Post Cover"}/>
        <p>{description}</p>
      </Card>
    </>
  );
}

export default PostPage;
