import React from "react";

//Custom Component
import BundleButton from "../StyleButton/BundleButton";

const BlockStyleControls = (props) => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  return (
    <BundleButton
      id={props.id}
      title={props.title}
      config={props.config}
      onToggle={props.onToggle}
      isDarkMode={props.isDarkMode}
      active={blockType}
    />
  );
};

export default BlockStyleControls;
