import React, { useContext } from "react";

//Custom Context
import { ThemeContext } from "../context/theme-context";

//Custom Component
import Card from "../components/UI/Card";

function AboutPage() {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <Card className="page" isDarkMode={isDarkMode}>
      <h1>AboutPage</h1>
    </Card>
  );
}

export default AboutPage;
