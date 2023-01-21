import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RichUtils, getDefaultKeyBinding, convertToRaw } from "draft-js";

import Editor from "@draft-js-plugins/editor";

//Redux Slice
import { toolbarActions } from "../../../store/toolbar-slice";

//Custom Function
import { styleMap } from "../../util/style-map";
import plugins, { AlignmentTool } from "./Plugin";
import { getBlockStyle, getCustomStyleFn } from "./CustomStyleFn";
import { createLinkDecorator } from "./decorators/LinkDecorator";

//Custom Component
import ToolBar from "./ToolBar/ToolBar";
import Button2 from "../Form/Button2";

//CSS
import "draft-js/dist/Draft.css";
import "./RichTextEditor.css";

const decorator = createLinkDecorator();

function RichTextEditor(props) {
  const { editorState, onChange, className } = props;
  const editor = useRef(null);
  const [rawData, setRawData] = useState(null);

  //Redux
  const isDarkMode = useSelector((state) => state.theme.value);
  const dispatch = useDispatch();

  const focusEditorHandler = () => {
    editor.current.focus();
    dispatch(toolbarActions.closeAll());
  };

  const handleKeyCommandHandler = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onChange(newState);
      return true;
    }
    return false;
  };
  
  const mapKeyToEditorCommandHandler = (event) => {
    if (event.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(
        event,
        editorState,
        4 /* maxDepth */
      );

      if (newEditorState !== editorState) {
        onChange(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(event);
  };

  return (
    <>
      <div
        className={`editor-wrapper ${className} ${
          isDarkMode ? "editor-wrapper-dark" : "editor-wrapper-light"
        }`}
      >
        <ToolBar
          editorState={editorState}
          setEditorState={onChange}
          isDarkMode={isDarkMode}
        />
        <div className={"editor-container"} onClick={focusEditorHandler}>
          <Editor
            ref={editor}
            editorState={editorState}
            onChange={onChange}
            decorators={[decorator]}
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            customStyleFn={getCustomStyleFn}
            handleKeyCommand={handleKeyCommandHandler}
            keyBindingFn={mapKeyToEditorCommandHandler}
            placeholder="Tell a story..."
            spellCheck={true}
            plugins={plugins}
          />
        </div>
        <AlignmentTool />
      </div>
      <div className={`btn-container`}>
        <Button2
          className={`btn`}
          onClick={() => {
            console.log("Click");
            const currentContent = editorState.getCurrentContent();
            const rawData = convertToRaw(currentContent);
            const rawJson = JSON.stringify(rawData);
            setRawData(rawJson);
          }}
        >
          SAVE
        </Button2>
        <Button2
          className={`btn`}
          onClick={() => {
            console.log("Click");
            const currentContent = editorState.getCurrentContent();
            const rawData = convertToRaw(currentContent);
            const rawJson = JSON.stringify(rawData);
            setRawData(rawJson);
          }}
        >
          DELETE
        </Button2>
      </div>
      <p>{rawData}</p>
    </>
  );
}

export default RichTextEditor;
//reference 1:https://draftjs.org/docs/quickstart-rich-styling
//reference 2:https://www.youtube.com/watch?v=t12a6z090AU
//reference 3:https://www.youtube.com/watch?v=0pPlbLyeclI
//reference 4:https://codepen.io/michael_cox/pen/KmQJbZ
