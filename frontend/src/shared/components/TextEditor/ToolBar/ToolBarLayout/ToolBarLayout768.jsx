import React from "react";

//Custom Function
import { toolbar } from "../../../../util/toolbar-setting";

//Custom Component
import ToolBarBundle from "../ToolBarBundle";

//CSS
import classes from "./ToolBarLayout768.module.css";

function ToolBarLayout768(props) {
  const { editorState, setEditorState } = props;
  return (
    <>
      <div className={classes["toolbar-row-1"]}>
        <ToolBarBundle
          key={"toolbar-bundle-1"}
          toolbar={toolbar}
          options={["blockTypeFlat", "image", "map", "embedded", "link"]}
          editorState={editorState}
          onChange={setEditorState}
        />
        <ToolBarBundle
          key={"toolbar-bundle-2"}
          toolbar={toolbar}
          options={["remove", "history"]}
          editorState={editorState}
          onChange={setEditorState}
        />
      </div>
      <div className={classes["toolbar-row-2"]}>
        <ToolBarBundle
          key={"toolbar-bundle-3"}
          toolbar={toolbar}
          options={[
            "inline",
            "blockTypeDrop",
            "fontSize",
            "colorPicker",
            "fontFamily",
          ]}
          editorState={editorState}
          onChange={setEditorState}
        />
        <ToolBarBundle
          key={"toolbar-bundle-4"}
          toolbar={toolbar}
          options={["textAlign"]}
          editorState={editorState}
          onChange={setEditorState}
        />
      </div>
    </>
  );
}

export default ToolBarLayout768;
