import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RichUtils, getDefaultKeyBinding } from "draft-js";
import Editor from "@draft-js-plugins/editor";

//Redux Slice
import { toolbarActions } from "../../../store/toolbar-slice";

//Custom Function
import Card from "../UI/Card";
import { styleMap } from "../../util/style-map";
import plugins, { AlignmentTool } from "./Plugin";
import { getBlockStyle, getCustomStyleFn } from "./CustomStyleFn";
import { createLinkDecorator } from "./decorators/LinkDecorator";
import UploadImage from "../../components/Form/UploadImage";
import PostDetailTitle from "../../../blogs/components/PostDetail/PostDetailTitle";

//Custom Component
import ToolBar from "./ToolBar/ToolBar";

//CSS
import "draft-js/dist/Draft.css";
import "./PostEditor.css";
import classes from "./PostEditor.module.css";

const decorator = createLinkDecorator();
const options = { year: "numeric", month: "short", day: "numeric" };

function PostEditor(props) {
  const { editorState, onChange, titleState, onTitle, className } = props;
  const [isDrag, setIsDrag] = useState(false);
  const titleEditor = useRef(null);
  const editor = useRef(null);

  //Redux
  const { name: authorName, avatar: authorAvatar } = useSelector(
    (state) => state.auth
  );
  const isDarkMode = useSelector((state) => state.theme.value);
  const dispatch = useDispatch();

  const focusEditorHandler = () => {
    editor.current.focus();
    dispatch(toolbarActions.closeAll());
  };

  const titleContent = (
    <Editor
      ref={titleEditor}
      editorState={titleState}
      onChange={onTitle}
      placeholder="Title..."
      textAlignment="center"
    />
  );

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

  //When Drag in trigger upload area
  const dragHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter") {
      setIsDrag(true);
    }
  };
  //todo Add image upload function
  return (
    <div
      className={`${classes["editor-wrapper"]} ${className} ${
        isDarkMode ? "editor-wrapper-dark" : "editor-wrapper-light"
      }`}
    >
      <ToolBar
        editorState={editorState}
        setEditorState={onChange}
        isDarkMode={isDarkMode}
      />
      <Card
        className={`page ${classes["post-container"]}`}
        isDarkMode={isDarkMode}
      >
        <PostDetailTitle
          title={titleContent}
          authorName={authorName}
          authorAvatar={authorAvatar}
          date={new Date().toLocaleDateString("en-US", options)}
          isDarkMode={isDarkMode}
          isNew
        />
        <div onDragEnter={dragHandler}>
          <UploadImage
            className={classes["cover"]}
            isDarkMode={isDarkMode}
            isDrag={isDrag}
            onDrag={setIsDrag}
            onInput={()=>{}}
          />
        </div>
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
          onClick={focusEditorHandler}
        />
      </Card>
      <AlignmentTool />
    </div>
  );
}

export default PostEditor;
//reference 1:https://draftjs.org/docs/quickstart-rich-styling
//reference 2:https://www.youtube.com/watch?v=t12a6z090AU
//reference 3:https://www.youtube.com/watch?v=0pPlbLyeclI
//reference 4:https://codepen.io/michael_cox/pen/KmQJbZ
//reference 5:https://stackoverflow.com/questions/65548792/how-to-upload-multiple-file-with-react-node-and-multer
