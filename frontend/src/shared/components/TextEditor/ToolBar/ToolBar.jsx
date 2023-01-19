import React from "react";

//Custom Function
import { toolbar } from "../../../util/toolbar-setting";

//Custom Component
import ToolBarBundle from "./ToolBarBundle";

//CSS
import classes from "./ToolBar.module.css";

function ToolBar(props) {
  const { editorState, setEditorState } = props;

  //Very Import to prevent the Text editor force when chooseing
  //the tool bar to keep Selection text on text editor
  const preventDefaultHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div
      className={`${classes["container"]} ${
        props.isDarkMode
          ? classes["container-dark"]
          : classes["container-light"]
      } `}
      onMouseDown={preventDefaultHandler}
    >
      <div className={classes["toolbar-row-1"]}>
        <ToolBarBundle
          key={"toolbar-bundle-1"}
          toolbar={toolbar}
          options={toolbar.options[0]}
          editorState={editorState}
          onChange={setEditorState}
        />
        <ToolBarBundle
          key={"toolbar-bundle-2"}
          toolbar={toolbar}
          options={toolbar.options[1]}
          editorState={editorState}
          onChange={setEditorState}
        />
      </div>
      <div className={classes["toolbar-row-2"]}>
        <ToolBarBundle
          key={"toolbar-bundle-3"}
          toolbar={toolbar}
          options={toolbar.options[2]}
          editorState={editorState}
          onChange={setEditorState}
        />
        <ToolBarBundle
          key={"toolbar-bundle-4"}
          toolbar={toolbar}
          options={toolbar.options[3]}
          editorState={editorState}
          onChange={setEditorState}
        />
      </div>
    </div>
  );
}

export default ToolBar;
//reference 4:https://www.youtube.com/watch?v=PuzqX5dxxKs
//reference 5:https://stackoverflow.com/questions/57213374/reactjs-and-draftjs-how-to-change-font-size-on-the-fly
