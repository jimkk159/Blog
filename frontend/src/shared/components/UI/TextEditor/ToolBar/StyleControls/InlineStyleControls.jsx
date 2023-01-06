import React from "react";

//Custom Component
import BundleButton from "../StyleButton/BundleButton";

const InlineStyleControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <BundleButton
      id={props.id}
      title={props.title}
      config={props.config}
      onToggle={props.onToggle}
      isDarkMode={props.isDarkMode}
      active={(style) => currentStyle.has(style)}
    />
  );
};

export default InlineStyleControls;
