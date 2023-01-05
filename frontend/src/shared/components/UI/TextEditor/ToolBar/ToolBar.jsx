import React from "react";
import { RichUtils } from "draft-js";

import { toolbar } from "./toolbar-setting";

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
      {toolbar.options.map((opt, index) => {
        const config = toolbar[opt];
        if (toolbar[opt].type === "blockType")
          return (
            <BlockStyleControls
              key={index}
              id={opt}
              config={config}
              editorState={editorState}
              onToggle={toggleBlockTypeHandler}
              isDarkMode={props.isDarkMode}
            />
          );
        return (
          <InlineStyleControls
            key={index}
            id={opt}
            config={config}
            editorState={editorState}
            onToggle={toggleInlineStyleHandler}
            isDarkMode={props.isDarkMode}
          />
        );
      })}
    </div>
  );
}

export default ToolBar;
//reference 4:https://www.youtube.com/watch?v=PuzqX5dxxKs
//reference 5:https://stackoverflow.com/questions/57213374/reactjs-and-draftjs-how-to-change-font-size-on-the-fly
