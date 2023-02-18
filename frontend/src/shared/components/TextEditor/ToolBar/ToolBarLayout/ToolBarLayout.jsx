import React from "react";

//Custom Function
import { toolbar } from "../../../../util/toolbar-setting";

//Custom Component
import ToolBarBundle from "../ToolBarBundle";

//CSS
import classes from "./ToolBarLayout.module.css";

function ToolBarLayout({ editorState, onChange }) {

  return (
    <>
      <div className={classes["toolbar-row-1"]}>
        <ToolBarBundle
          key={"toolbar-bundle-1"}
          toolbar={toolbar}
          options={["blockTypeFlat", "textAlign"]}
          editorState={editorState}
          onChange={onChange}
        />
        <ToolBarBundle
          key={"toolbar-bundle-2"}
          toolbar={toolbar}
          options={["image", "map", "embedded", "link", "remove", "history"]}
          editorState={editorState}
          onChange={onChange}
        />
      </div>
      <div className={classes["toolbar-row-2"]}>
        <ToolBarBundle
          key={"toolbar-bundle-3"}
          toolbar={toolbar}
          options={["inline"]}
          editorState={editorState}
          onChange={onChange}
        />
        <ToolBarBundle
          key={"toolbar-bundle-4"}
          toolbar={toolbar}
          options={["blockTypeDrop", "fontSize", "colorPicker", "fontFamily"]}
          editorState={editorState}
          onChange={onChange}
        />
      </div>
    </>
  );
}

export default ToolBarLayout;
