import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RichUtils, Editor, EditorState, getDefaultKeyBinding } from "draft-js";

//Redux Slice
import { toolbarActions } from "../../../../store/toolbar-slice";

//Custom Function
import { styleMap } from "./style-map";
import { createLinkDecorator } from "./decorators/LinkDecorator";
import { removeTargetInlineStyles } from "./ToolBar/StyleControls/RemoveControls";

//Custom Component
import ToolBar from "./ToolBar/ToolBar";

//CSS
import "draft-js/dist/Draft.css";
import "./RichTextEditor.css";

function getBlockStyle(block) {
  switch (block.getType()) {
    case "blockquote":
      return "RichEditor-blockquote";
    case "ALIGN_RIGHT":
      return "ALIGN_RIGHT";
    case "ALIGN_CENTER":
      return "ALIGN_CENTER";
    case "ALIGN_LEFT":
      return "ALIGN_LEFT";
    case "ALIGN_JUSTIFY":
      return "ALIGN_JUSTIFY";
    default:
      return null;
  }
}

const CUSTOM_STYLE_PREFIX_COLOR = "COLOR_";
const CUSTOM_STYLE_PREFIX_FONT_SIZE = "FONT_SIZE_";
function getCustomStyleFn(style) {
  const styleNames = style.toJS();
  return styleNames.reduce((styles, styleName) => {
    if (styleName.startsWith(CUSTOM_STYLE_PREFIX_COLOR)) {
      styles.color = `${styleName.split(CUSTOM_STYLE_PREFIX_COLOR)[1]}`;
    }
    if (styleName.startsWith(CUSTOM_STYLE_PREFIX_FONT_SIZE)) {
      styles.fontSize = `${
        styleName.split(CUSTOM_STYLE_PREFIX_FONT_SIZE)[1]
      }px`;
    }
    return styles;
  }, {});
}

function RichTextEditor(props) {
  const editor = useRef(null);
  const decorator = createLinkDecorator();
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(decorator)
  );
  
  //Redux
  const isDarkMode = useSelector((state) => state.theme.value);
  const isLinkModal = useSelector((state) => state.toolbar.isLinkModal);
  const dispatch = useDispatch();

  const focusEditorHandler = () => {
    editor.current.focus();
    dispatch(toolbarActions.closeAll());
  };

  const handleKeyCommandHandler = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
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
        setEditorState(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(event);
  };
  
  useEffect(() => {
    if (!isLinkModal) {
      setEditorState(removeTargetInlineStyles(editorState, ["FAKE_FOCUS"]));
    }
  }, [isLinkModal, editorState]);

  return (
    <>
      <div
        className={`editor-wrapper ${
          isDarkMode ? "editor-wrapper-dark" : "editor-wrapper-light"
        }`}
      >
        <ToolBar
          editorState={editorState}
          setEditorState={setEditorState}
          isDarkMode={isDarkMode}
        />
        <div className={"editor-container"} onClick={focusEditorHandler}>
          <Editor
            ref={editor}
            editorState={editorState}
            onChange={setEditorState}
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            customStyleFn={getCustomStyleFn}
            handleKeyCommand={handleKeyCommandHandler}
            keyBindingFn={mapKeyToEditorCommandHandler}
            placeholder="Tell a story..."
            spellCheck={true}
          />
        </div>
      </div>
      <button onClick={null}>Click</button>
      <Editor
        editorState={EditorState.createWithContent(
          editorState.getCurrentContent()
        )}
        readOnly
      />
    </>
  );
}

export default RichTextEditor;
//reference 1:https://draftjs.org/docs/quickstart-rich-styling
//reference 2:https://www.youtube.com/watch?v=t12a6z090AU
//reference 3:https://www.youtube.com/watch?v=0pPlbLyeclI
//reference 4:https://codepen.io/michael_cox/pen/KmQJbZ
