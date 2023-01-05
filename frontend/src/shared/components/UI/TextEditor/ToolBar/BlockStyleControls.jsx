import React from "react";

//Custom Component
import StyleButton from "./StyleButton";
import DropDownButton from "./DropDownButton";

//CSS
import classes from "./BlockStyleControls.module.css";

const BlockStyleControls = (props) => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  let content;
  if (props.config.inDropdown) {
    content = (
      <DropDownButton
        id={props.id}
        config={props.config}
        onToggle={props.onToggle}
        isDarkMode={props.isDarkMode}
      />
    );
  } else {
    content = props.config.options.map((option) => {
      const opt = props.config[option];
      return (
        <StyleButton
          key={opt.label}
          id={props.id}
          className={classes["item"]}
          active={opt.style === blockType}
          label={opt.label}
          icon={opt.icon}
          onToggle={props.onToggle}
          style={opt.style}
          isDarkMode={props.isDarkMode}
        />
      );
    });
  }
  return <div className={classes["container"]}>{content}</div>;
};

export default BlockStyleControls;
