import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

//Custom Comonent
import Card from "../../shared/components/UI/Card";

function PostSearchPage() {
  //Redux
  const isDarkMode = useSelector((state) => state.theme.value);

  //React-Router
  const { searchItem } = useParams();

  return (
    <Card className="page" isDarkMode={isDarkMode}>
      <h1>{searchItem}</h1>
    </Card>
  );
}

export default PostSearchPage;
