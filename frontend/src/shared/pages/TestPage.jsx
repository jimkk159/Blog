import React from "react";
import { useSelector } from "react-redux";

//Custom Component
import Card from "../components/UI/Card";
import LoadingSpinner from "../components/UI/LoadingSpinner";

function TestPage() {
  const isDarkMode = useSelector((state) => state.theme.value);
  return (
    <Card className="page" isDarkMode={isDarkMode}>
      <LoadingSpinner asOverlay isDarkMode={isDarkMode}/>
    </Card>
  );
}

export default TestPage;