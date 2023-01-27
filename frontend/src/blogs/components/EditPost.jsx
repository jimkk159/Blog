import React from "react";

//Custom Component
import RichTextEditor from "../../shared/components/TextEditor/RichTextEditor";

function EditPost(props) {
  const { editorState, onChange, onRead, originState } = props;
  
  return (
    <RichTextEditor
      editorState={editorState}
      onChange={onChange}
      onRead={onRead}
      originState={originState}
    />
  );
}

export default EditPost;
