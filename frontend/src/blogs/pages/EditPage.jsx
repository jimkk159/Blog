import React from "react";
import { useSelector } from "react-redux";

//Custom Component
import Card from "../../shared/components/UI/Card"
import RichTextEditor from "../../shared/components/UI/TextEditor/RichTextEditor";

import classes from "./EditPage.module.css"

function EditPage() {
  const isDarkMode = useSelector((state) => state.theme.value);
  return (
    <Card className="page" isDarkMode={isDarkMode}>
    <a href="https://www.google.com/">123</a>
      <h1 className={classes["select"]}>Edit Page</h1>
      <RichTextEditor />
    </Card>
  );
}

export default EditPage;
