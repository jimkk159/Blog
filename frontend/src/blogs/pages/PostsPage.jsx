import React, { useContext } from "react";

//Custom Context
import { ThemeContext } from "../../shared/context/theme-context";

//Custom Comonent
import Card from "../../shared/components/UI/Card";

function PostsPage() {
  const { isDarkMode } = useContext(ThemeContext);
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
