import React, { useContext } from "react";

//Custom Context
import { ThemeContext } from "../context/theme-context";

//Custom Component
import Card from "../components/UI/Card";
import LoadingSpinner from "../components/UI/LoadingSpinner";

function TestPage() {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <Card className="page" isDarkMode={isDarkMode}>
      <LoadingSpinner asOverlay isDarkMode={isDarkMode}/>
    </Card>
  );
}

export default TestPage;