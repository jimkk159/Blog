import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RichUtils, Editor, EditorState, getDefaultKeyBinding } from "draft-js";

//Custom Function
import ToolBar from "./ToolBar/ToolBar";
import defaultToolbar from "../../../util/defaultToolbar";

//CSS
import "draft-js/dist/Draft.css";
import "./MyEditor.css";

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

function getBlockStyle(block) {
  switch (block.getType()) {
    case "blockquote":
      return "RichEditor-blockquote";
    default:
      return null;
  }
}

export default function MyEditor(props) {
  const toolbar = defaultToolbar;
  const isDarkMode = useSelector((state) => state.theme.value);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const editor = useRef(null);
  const focusEditor = () => {
    editor.current.focus();
  };

  const handleKeyCommandHandler = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return true;
    }
    return false;
  };

  const mapKeyToEditorCommandHandler = (event) => {
    if (event.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(
        event,
        editorState,
        4 /* maxDepth */
      );

      if (newEditorState !== editorState) {
        setEditorState(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(event);
  };

  return (
    <>
      <div
        className={`editor-wrapper ${
          isDarkMode ? "editor-wrapper-dark" : "editor-wrapper-light"
        }`}
      >
        <ToolBar
          editorState={editorState}
          setEditorState={setEditorState}
          isDarkMode={isDarkMode}
        />
        <div className={"editor-container"} onClick={focusEditor}>
          <Editor
            ref={editor}
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={handleKeyCommandHandler}
            keyBindingFn={mapKeyToEditorCommandHandler}
            onChange={setEditorState}
            placeholder="Tell a story..."
            spellCheck={true}
          />
        </div>
      </div>
      <button onClick={null}>Click</button>
      <Editor
        editorState={EditorState.createWithContent(
          editorState.getCurrentContent()
        )}
      />
    </>
  );
}
//reference 1:https://draftjs.org/docs/quickstart-rich-styling
//reference 2:https://www.youtube.com/watch?v=t12a6z090AU
//reference 3:https://www.youtube.com/watch?v=0pPlbLyeclI
