import React from "react";

//Custom Function
import { toolbar } from "../../../../util/toolbar-setting";

//Custom Component
import ToolBarBundle from "../ToolBarBundle";

//CSS
import classes from "./ToolBarLayoutSide.module.css";

function ToolBarLayoutSide({ editorState, onChange }) {
  return (
    <>
      <div className={classes["toolbar-row"]}>
        <div className={classes["toolbar-split"]}>
          <ToolBarBundle
            key={"toolbar-side-1"}
            toolbar={toolbar}
            options={["image", "map", "embedded"]}
            editorState={editorState}
            onChange={onChange}
          />
          <ToolBarBundle
            key={"toolbar-side-2"}
            toolbar={toolbar}
            options={["remove", "history"]}
            editorState={editorState}
            onChange={onChange}
          />
        </div>
        <div className={classes["toolbar-split"]}>
          <ToolBarBundle
            key={"toolbar-side-3"}
            toolbar={toolbar}
            options={["inline"]}
            editorState={editorState}
            onChange={onChange}
          />
          <ToolBarBundle
            key={"toolbar-side-4"}
            toolbar={toolbar}
            options={["link"]}
            editorState={editorState}
            onChange={onChange}
          />
        </div>
        <div className={classes["toolbar-split"]}>
          <ToolBarBundle
            key={"toolbar-side-5"}
            toolbar={toolbar}
            options={["blockTypeDrop"]}
            editorState={editorState}
            onChange={onChange}
          />
          <ToolBarBundle
            key={"toolbar-side-6"}
            toolbar={toolbar}
            options={["colorPicker", "textAlign"]}
            editorState={editorState}
            onChange={onChange}
          />
        </div>
        <ToolBarBundle
          key={"toolbar-side-7"}
          className={classes["toolbar-split"]}
          toolbar={toolbar}
          options={["fontFamily", "fontSize", "blockTypeFlat"]}
          editorState={editorState}
          onChange={onChange}
        />
      </div>
    </>
  );
}

export default ToolBarLayoutSide;
