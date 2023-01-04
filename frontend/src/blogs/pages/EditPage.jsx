import React from "react";
import { useSelector } from "react-redux";

//Custom Component
import Card from "../../shared/components/UI/Card"
import MyEditor from "../../shared/components/UI/TextEditor/MyEditor";
// import RichTextEditor from "../../shared/components/UI/TextEditor/RichTextEditor";

function EditPage() {
  const isDarkMode = useSelector((state) => state.theme.value);
  return (
    <Card className="page" isDarkMode={isDarkMode}>
      <h1>Edit Page</h1>
      <MyEditor />
      {/* <RichTextEditor /> */}
    </Card>
  );
}

export default EditPage;
