import React from "react";

//Icon
import { RxCross2 } from "react-icons/rx";
import ToolBarLayoutSide from "../../shared/components/TextEditor/ToolBar/ToolBarLayout/ToolBarLayoutSide";

//Custom Comonent
import Card from "../../shared/components/UI/Card";

//CSS
import classes from "./ScrollToolOpen.module.css";

function ScrollToolOpen({
  className,
  editorState,
  onChange,
  isDarkMode,
  onClose,
}) {
  const preventDefaultHandler = (event) => {
    event.preventDefault();
  };
  return (
    <Card
      className={`${className} ${classes["container"]} ${
        isDarkMode ? null : classes["container-light"]
      }`}
      isDarkMode={isDarkMode}
    >
      <RxCross2
        className={`${classes["cross"]} ${
          isDarkMode ? classes["cross-dark"] : classes["cross-light"]
        }`}
        onClick={onClose}
      />
      <div onMouseDown={preventDefaultHandler}>
        <ToolBarLayoutSide editorState={editorState} onChange={onChange} />
      </div>
    </Card>
  );
}

export default ScrollToolOpen;
