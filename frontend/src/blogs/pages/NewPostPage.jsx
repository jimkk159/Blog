import React from "react";
import { useSelector } from "react-redux";

//Custom Component
import Card from "../../shared/components/UI/Card";

function NewPostPage() {
  const isDarkMode = useSelector((state)=>state.theme.value)
  return <Card isDarkMode={isDarkMode}>NewPostPage</Card>;
}

export default NewPostPage;
