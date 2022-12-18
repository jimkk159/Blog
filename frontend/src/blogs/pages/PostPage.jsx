import React, { useContext } from "react";

//Custom Context
import { ThemeContext } from "../../shared/context/theme-context";

//Custom Comonent
import Card from "../../shared/components/UI/Card";

function PostPage() {
  const { isDarkMode } = useContext(ThemeContext);
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
