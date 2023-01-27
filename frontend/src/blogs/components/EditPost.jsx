import React from "react";

//Custom Component
import RichTextEditor from "../../shared/components/TextEditor/RichTextEditor";

function EditPost(props) {
  const { editorState, setEditorState } = props;

  return <RichTextEditor editorState={editorState} onChange={setEditorState} />;
}

export default EditPost;
