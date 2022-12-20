import React from "react";
import { useSelector } from "react-redux";

//Custom Comonent
import Card from "../../shared/components/UI/Card";

function PostsPage() {
  const isDarkMode = useSelector((state)=>state.theme.value);
  return (
    <div className="page">
      <h1>Title</h1>
      <Card className="page" isDarkMode={isDarkMode}>
        <p>PostPage</p>
      </Card>
    </div>
  );
}

export default PostsPage;
