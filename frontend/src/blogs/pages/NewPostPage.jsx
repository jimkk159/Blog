import React, { useContext } from "react";

//Custom Context
import { ThemeContext } from "../../shared/context/theme-context";

//Custom Component
import Card from "../../shared/components/UI/Card";

function NewPostPage() {
  const { isDarkMode } = useContext(ThemeContext);
  return <Card isDarkMode={isDarkMode}>NewPostPage</Card>;
}

export default NewPostPage;
