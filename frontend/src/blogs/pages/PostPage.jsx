import React from "react";
import { useSelector } from "react-redux";

//Custom Comonent
import Card from "../../shared/components/UI/Card";

function PostPage() {
  const isDarkMode = useSelector((state) => state.theme.value);
  return (
    <>
      <h1>Title</h1>
      <Card className="page" isDarkMode={isDarkMode}>
        <p>PostPage</p>
      </Card>
    </>
  );
}

export default PostPage;
