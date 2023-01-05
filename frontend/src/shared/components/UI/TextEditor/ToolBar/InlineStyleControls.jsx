import React from "react";

//Custom Component
import StyleButton from "./StyleButton";
import DropDownButton from "./DropDownButton";

//CSS
import classes from "./InlineStyleControls.module.css";

const InlineStyleControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();

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
          active={currentStyle.has(opt.style)}
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

export default InlineStyleControls;
