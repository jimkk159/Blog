import React from "react";
import { useSelector } from "react-redux";

//Custom Component
import Card from "../components/UI/Card";


function AboutPage() {
  const isDarkMode = useSelector((state) => state.theme.value);
  return (
    <Card className="page" isDarkMode={isDarkMode}>
      <h1>AboutPage</h1>
    </Card>
  );
}

export default AboutPage;
