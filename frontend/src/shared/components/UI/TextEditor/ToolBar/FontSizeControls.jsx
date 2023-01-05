import React from "react";

//Custom Component
import StyleButton from "./StyleButton";

//CSS
import classes from "./BlockStyleControls.module.css";

const FontSizeControls = (props) => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className={classes["container"]}>
      {props.config.options.map((opt, index) => {
        return (
          <StyleButton
            key={props.config[opt].label}
            className={classes["item"]}
            active={props.config[opt].style === blockType}
            label={props.config[opt].label}
            icon={props.config[opt].icon}
            onToggle={props.onToggle}
            style={props.config[opt].style}
            isDarkMode={props.isDarkMode}
          />
        );
      })}
    </div>
  );
};

export default FontSizeControls;
