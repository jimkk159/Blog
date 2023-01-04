import React, { useRef, useState } from "react";
import {
  createWithContent,
  convertFromRaw,
  convertToRaw,
  Editor,
  EditorState,
} from "draft-js";
import "draft-js/dist/Draft.css";
import draftToHtml from "draftjs-to-html";

export default function MyEditor(props) {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [showHtml, setShowHtml] = useState(() => EditorState.createEmpty());
  const editor = useRef(null);
  const focusEditor = () => {
    editor.current.focus();
  };

  const getResult = () => {
    console.log(JSON.stringify(editorState.getCurrentContent()));
    console.log(convertToRaw(editorState.getCurrentContent()));
    console.log(editorState.getCurrentContent());
    console.log(convertFromRaw(convertToRaw(editorState.getCurrentContent())));
    setShowHtml(convertFromRaw(convertToRaw(editorState.getCurrentContent())));
    console.log(draftToHtml(showHtml));
  };
  return (
    <>
      <div
        style={{ border: "1px solid black", minHeight: "6em", cursor: "text" }}
        onClick={focusEditor}
      >
        <Editor
          ref={editor}
          editorState={editorState}
          onChange={setEditorState}
          placeholder="Write something!"
        />
      </div>
      <button onClick={getResult}>Click</button>
      <Editor
        editorState={EditorState.createWithContent(
          editorState.getCurrentContent()
        )}
      />
    </>
  );
}
