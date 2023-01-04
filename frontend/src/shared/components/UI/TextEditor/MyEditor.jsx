import React, { useRef, useState } from "react";
import { RichUtils, Editor, EditorState, getDefaultKeyBinding } from "draft-js";
import "draft-js/dist/Draft.css";

//Custom Component
import BlockStyleControls from "./BlockStyleControls";
import InlineStyleControls from "./InlineStyleControls";

//CSS
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

  const toggleBlockTypeHandler = (blockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const toggleInlineStyleHandler = (inlineStyle) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  return (
    <>
      <div className={"RichEditor-root"}>
        <BlockStyleControls
          editorState={editorState}
          onToggle={toggleBlockTypeHandler}
        />

        <InlineStyleControls
          editorState={editorState}
          onToggle={toggleInlineStyleHandler}
        />
        <div className={"RichEditor-editor"} onClick={focusEditor}>
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
