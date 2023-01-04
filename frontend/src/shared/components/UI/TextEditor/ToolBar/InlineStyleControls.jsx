import React from "react";

import { inlineStyles } from "./toolbar-setting";

//Custom Component
import StyleButton from "./StyleButton";

//CSS
import classes from "./InlineStyleControls.module.css";


const InlineStyleControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();

  return (
    <div className={classes["container"]}>
      {inlineStyles.map((type) => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
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

export default InlineStyleControls;
