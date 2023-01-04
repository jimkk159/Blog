import React from "react";

import { blockTypes } from "./toolbar-setting";

//Custom Component
import StyleButton from "./StyleButton";

//CSS
import classes from "./BlockStyleControls.module.css"

const BlockStyleControls = (props) => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className={classes["container"]}>
      {blockTypes.map((type) => (
        <StyleButton
          key={type.label}
          className={classes["item"]}
          active={type.style === blockType}
          label={type.label}
          icon={type.icon}
          onToggle={props.onToggle}
          style={type.style}
          isDarkMode={props.isDarkMode}
        />
      ))}
    </div>
  );
};

export default BlockStyleControls;
