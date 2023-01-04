import React from "react";
import { RichUtils } from "draft-js";

//Custom Component
import BlockStyleControls from "./BlockStyleControls";
import InlineStyleControls from "./InlineStyleControls";

//CSS
import classes from "./ToolBar.module.css";

function ToolBar(props) {
  const { editorState, setEditorState } = props;
  const toggleBlockTypeHandler = (blockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const toggleInlineStyleHandler = (inlineStyle) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };
  return (
    <div
      className={`${classes["container"]} ${
        props.isDarkMode
          ? classes["container-dark"]
          : classes["container-light"]
      } `}
    >
      <BlockStyleControls
        editorState={editorState}
        onToggle={toggleBlockTypeHandler}
        isDarkMode={props.isDarkMode}
      />
      <InlineStyleControls
        editorState={editorState}
        onToggle={toggleInlineStyleHandler}
        isDarkMode={props.isDarkMode}
      />
    </div>
  );
}

export default ToolBar;
//reference 4:https://www.youtube.com/watch?v=PuzqX5dxxKs
